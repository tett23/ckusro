import mdx from '@mdx-js/mdx';
import { extname, join as joinPath } from 'path';
import { curry } from 'ramda';
import { CkusroConfig } from '../config';
import { CkusroFile, isWritableFileType } from '../loader';
import { FileType, FileTypeMarkdown, FileTypeText } from '../loader';
import wikiLink from '../parser/wikiLink';
import buildGlobalState from './buildGlobalState';
import writeFile from './io';

export default async function render(config: CkusroConfig) {
  const globalState = await buildGlobalState(config);

  if (globalState instanceof Error) {
    return globalState;
  }

  const curriedBuildWriteInfo = curry(buildWriteInfo)(
    config.outputDirectory,
    globalState.context.name,
  );

  const ps: Array<Promise<boolean>> = globalState.files
    .flatMap(filterWritable)
    .map(curriedBuildWriteInfo)
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

export type WriteInfo = {
  path: string;
  content: string | Buffer;
};

export function buildWriteInfo(
  outputDirectory: string,
  contextName: string,
  file: CkusroFile,
): WriteInfo {
  if (!file.isLoaded || file.content == null) {
    throw new Error('');
  }

  return {
    path: determineAbsolutePath(
      outputDirectory,
      contextName,
      replacePath(file),
    ),
    content: buildHTML(parse(file.content), {}),
  };
}

export function parse(content: string) {
  return mdx.sync(content, {
    mdPlugins: [[wikiLink, {}]],
  });
}

export function buildHTML(mdxText: any, props: any) {
  return `
  <html>
    <div id="root"></div>
    <script>window.DEFAULT_PROPS = ${JSON.stringify(props)}</script>
    <script>window.MDX = ${mdxText}</script>
    <script>
      const defaultProps = window.DEFAULT_PROPS
      ReactDOM.render(React.createElement(MyComponent, defaultProps), document.querySelector('#root'))
    </script>
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
