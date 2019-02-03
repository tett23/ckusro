import { join as joinPath } from 'path';
import { curry } from 'ramda';
import { allDepdendencies } from '../../../models/DependencyTable';
import {
  FileBuffer,
  FileBufferId,
  isWritableFileType,
  replaceExt,
} from '../../../models/FileBuffer';
import { FileBuffersState } from '../../../models/FileBuffersState';
import { GlobalState } from '../../../models/GlobalState';
import { OutputContext } from '../../../models/OutputContext';
import { Props } from './assets/components';
import writeFile from './io';
import render from './render';

export default async function staticRenderer(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<Array<true | Error>> {
  const items = await renderHTML(globalState, fileBuffersState);
  return items.flatMap((item) => item);
}

async function renderHTML(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<Array<true | Error>> {
  const curried = curry(renderEachNamesace)(globalState, fileBuffersState);
  const ps = globalState.namespaces
    .map((item) => item.outputContext)
    .map(curried);
  const items = await Promise.all(ps);

  return items.flatMap((item) => item);
}

export async function renderEachNamesace(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
  context: OutputContext,
): Promise<Array<true | Error>> {
  const curriedFilterNamespace = curry(filterNamespace)(context.name);
  const curriedBuildWriteInfo = curry(buildWriteInfo)(context);
  const curriedBuildProps = curry(buildProps)(globalState, fileBuffersState);

  const ps = fileBuffersState.fileBuffers
    .flatMap(curriedFilterNamespace)
    .flatMap(filterWritable)
    .map(curriedBuildWriteInfo)
    .map(
      ({ path, file }): [string, Props] => [path, curriedBuildProps(file.id)],
    )
    .map(([path, props]) => ({ path, content: buildHTML(props) }))
    .map(writeFile);

  return Promise.all(ps);
}

export function filterNamespace(
  namespace: string,
  file: FileBuffer,
): FileBuffer[] | [] {
  return namespace === file.namespace ? [file] : [];
}

export function filterWritable(file: FileBuffer): FileBuffer[] {
  const { fileType, content } = file;
  if (!isWritableFileType(fileType)) {
    return [];
  }
  if (content == null) {
    return [];
  }

  return [file];
}

export type FileInfo = {
  path: string;
  file: FileBuffer;
};

export function buildWriteInfo(
  context: OutputContext,
  file: FileBuffer,
): FileInfo {
  if (file.content == null) {
    throw new Error('');
  }

  return {
    path: determineAbsolutePath(context.path, replaceExt(file)),
    file,
  };
}

export function buildProps(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
  id: FileBufferId,
): Props {
  const dependency = fileBuffersState.dependencyTable[id];
  const ids = [id].concat(allDepdendencies(dependency));
  const deps = fileBuffersState.fileBuffers.filter((f) => ids.includes(f.id));

  return {
    globalState,
    fileBuffers: fileBuffersState.fileBuffers,
    markdown: {
      currentFileId: id,
      files: deps,
    },
  };
}

export function buildHTML(props: Props) {
  const { html, styles } = render(props);

  return `
<html>
  <head>
    ${styles}
  </head>
  <body>
    ${html}
  </body>
</html>
  `;
}

export function determineAbsolutePath(
  outputDir: string,
  filePath: string,
): string {
  if (!outputDir.startsWith('/')) {
    throw new Error('outputDir must start with `/`');
  }
  if (!filePath.startsWith('/')) {
    throw new Error('filePath must start with `/`');
  }

  return joinPath(outputDir, filePath);
}
