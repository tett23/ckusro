import mdx from '@mdx-js/mdx';
import { extname, join as joinPath } from 'path';
import { curry } from 'ramda';
import { CkusroConfig } from '../config';
import { CkusroFile, isWritableFileType } from '../loader';
import { FileType, FileTypeMarkdown, FileTypeText } from '../loader';
import wikiLink from '../parser/wikiLink';
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
    config.outputDirectory,
    globalState.context.name,
  );
  const curriedBuildProps = curry(buildProps)(globalState.files);

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
  outputDirectory: string,
  contextName: string,
  file: CkusroFile,
): FileInfo {
  if (!file.isLoaded || file.content == null) {
    throw new Error('');
  }

  return {
    path: determineAbsolutePath(
      outputDirectory,
      contextName,
      replacePath(file),
    ),
    file,
  };
}

export function buildProps(files: CkusroFile[], file: CkusroFile): Props {
  const strongDeps = file.strongDependencies.flatMap((id) => {
    const f = files.find((item) => id === item.id);

    return f != null ? [f] : [];
  });
  const weakDeps = file.weakDependencies.flatMap((id) => {
    const f = files.find((item) => id === item.id);

    return f != null ? [f] : [];
  });
  const deps = [file].concat(strongDeps).concat(weakDeps);

  return {
    fileId: file.id,
    files: deps,
  };
}

export function parse(content: string) {
  return mdx.sync(content, {
    mdPlugins: [[wikiLink, {}]],
  });
}

export function buildHTML(props: Props) {
  return `
<html>
  ${render(props)}
</html>
  `;
}

export function replacePath(file: CkusroFile): string {
  const ext = extname(file.path);
  const replaced = file.path.replace(ext, convertExt(file.fileType));

  return replaced;
}

export function convertExt(fileType: FileType): string {
  switch (fileType) {
    case FileTypeMarkdown:
      return '.html';
    case FileTypeText:
      return '.html';
    default:
      throw new Error('');
  }
}

export function determineAbsolutePath(
  outputDir: string,
  contextName: string,
  filePath: string,
): string {
  if (!outputDir.startsWith('/')) {
    throw new Error('outputDir must start with `/`');
  }
  if (!filePath.startsWith('/')) {
    throw new Error('filePath must start with `/`');
  }

  return joinPath(outputDir, contextName, filePath);
}
