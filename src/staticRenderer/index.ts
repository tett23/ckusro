import { join as joinPath } from 'path';
import { curry } from 'ramda';
import { separateErrors } from '../core/utils/errors';
import {
  CkusroFile,
  CkusroId,
  isWritableFileType,
  replaceExt,
} from '../models/CkusroFile';
import { OldGlobalState } from '../models/OldGlobalState';
import { OutputContext } from '../models/OutputContext';
import { jsAssets } from './assets';
import { Props } from './assets/components';
import writeFile from './io';
import render from './render';

export default async function staticRenderer(
  globalState: OldGlobalState,
): Promise<ReturnType<typeof separateErrors>> {
  const result = await jsAssets(globalState);
  if (result instanceof Error) {
    return [[], [result]];
  }

  const items = await renderHTML(globalState);
  const results = items.flatMap((item) => item);

  return separateErrors(results);
}

async function renderHTML(
  globalState: OldGlobalState,
): Promise<Array<true | Error>> {
  const curried = curry(renderEachNamesace)(globalState);
  const ps = globalState.outputContexts.map(curried);
  const items = await Promise.all(ps);

  return items.flatMap((item) => item);
}

export async function renderEachNamesace(
  globalState: OldGlobalState,
  context: OutputContext,
): Promise<Array<true | Error>> {
  const curriedFilterNamespace = curry(filterNamespace)(context.name);
  const curriedBuildWriteInfo = curry(buildWriteInfo)(context);
  const curriedBuildProps = curry(buildProps)(globalState);

  const ps = globalState.files
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
  file: CkusroFile,
): CkusroFile[] | [] {
  return namespace === file.namespace ? [file] : [];
}

export function filterWritable(file: CkusroFile): CkusroFile[] {
  const { fileType, content, isLoaded } = file;
  if (!isWritableFileType(fileType)) {
    return [];
  }
  if (!isLoaded || content == null) {
    return [];
  }

  return [file];
}

export type FileInfo = {
  path: string;
  file: CkusroFile;
};

export function buildWriteInfo(
  context: OutputContext,
  file: CkusroFile,
): FileInfo {
  if (!file.isLoaded || file.content == null) {
    throw new Error('');
  }

  return {
    path: determineAbsolutePath(context.path, replaceExt(file)),
    file,
  };
}

export function buildProps(globalState: OldGlobalState, id: CkusroId): Props {
  const { weakDependencies, strongDependencies } = globalState.dependencyTable[
    id
  ];
  const ids = [id].concat(weakDependencies).concat(strongDependencies);
  const deps = globalState.files.filter((f) => ids.includes(f.id));

  return {
    globalState,
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
