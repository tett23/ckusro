import { join as joinPath } from 'path';
import { curry } from 'ramda';
import { CkusroConfig } from '../models/ckusroConfig';
import {
  CkusroFile,
  isWritableFileType,
  replaceExt,
} from '../models/ckusroFile';
import { OutputContext } from '../models/outputContext';
import { Props } from './assets/components';
import buildGlobalState, { GlobalState } from './buildGlobalState';
import writeFile from './io';
import render from './render';

export default async function staticRenderer(config: CkusroConfig) {
  const globalState = await buildGlobalState(config);
  if (globalState instanceof Error) {
    return globalState;
  }

  const curriedBuildWriteInfo = curry(buildWriteInfo)(
    globalState.outputContexts[0],
  );
  const curriedBuildProps = curry(buildProps)(globalState);

  const ps: Array<Promise<boolean>> = globalState.files
    .flatMap(filterWritable)
    .map(curriedBuildWriteInfo)
    .map(({ path, file }): [string, Props] => [path, curriedBuildProps(file)])
    .map(([path, props]) => ({ path, content: buildHTML(props) }))
    .map(writeFile);

  return await Promise.all(ps);
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

export function buildProps(globalState: GlobalState, file: CkusroFile): Props {
  const strongDeps = file.strongDependencies.flatMap((id) => {
    const f = globalState.files.find((item) => id === item.id);

    return f != null ? [f] : [];
  });
  const weakDeps = file.weakDependencies.flatMap((id) => {
    const f = globalState.files.find((item) => id === item.id);

    return f != null ? [f] : [];
  });
  const deps = [file].concat(strongDeps).concat(weakDeps);

  return {
    globalState,
    markdown: {
      currentFileId: file.id,
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
