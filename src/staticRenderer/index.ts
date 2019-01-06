import { join as joinPath } from 'path';
import { curry } from 'ramda';
import { CkusroConfig } from '../models/ckusroConfig';
import {
  CkusroFile,
  CkusroId,
  isWritableFileType,
  replaceExt,
} from '../models/ckusroFile';
import buildGlobalState, { GlobalState } from '../models/globalState';
import { OutputContext } from '../models/outputContext';
import { Props } from './assets/components';
import writeFile from './io';
import render from './render';

export default async function staticRenderer(
  config: CkusroConfig,
): Promise<boolean[] | Error> {
  const globalState = await buildGlobalState(config);
  if (globalState instanceof Error) {
    return globalState;
  }

  const curried = curry(renderEachNamesace)(globalState);
  const ps = globalState.outputContexts.map(curried);

  return (await Promise.all(ps)).flatMap((items) => items);
}

export async function renderEachNamesace(
  globalState: GlobalState,
  context: OutputContext,
): Promise<boolean[]> {
  const curriedFilterNamespace = curry(filterNamespace)(context.name);
  const curriedBuildWriteInfo = curry(buildWriteInfo)(context);
  const curriedBuildProps = curry(buildProps)(globalState);

  const ps: Array<Promise<boolean>> = globalState.files
    .flatMap(curriedFilterNamespace)
    .flatMap(filterWritable)
    .map(curriedBuildWriteInfo)
    .map(
      ({ path, file }): [string, Props] => [path, curriedBuildProps(file.id)],
    )
    .map(([path, props]) => ({ path, content: buildHTML(props) }))
    .map(writeFile);

  return await Promise.all(ps);
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

export function buildProps(globalState: GlobalState, id: CkusroId): Props {
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
  return `
<html>
  ${render(props)}
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
