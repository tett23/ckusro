import mdx from '@mdx-js/mdx';
import { curry } from 'ramda';
import { CkusroConfig } from '../config';
import { CkusroFile, isWritableFileType } from '../loader';
import wikiLink from '../parser/wikiLink';
import buildGlobalState from './buildGlobalState';
import writeFile from './io';

export default async function render(config: CkusroConfig) {
  const globalState = await buildGlobalState(config);

  if (globalState instanceof Error) {
    return globalState;
  }

  const curriedWriteFile = curry(writeFile)(
    config.outputDirectory,
    globalState.context.name,
  );

  const ps: Array<Promise<boolean>> = globalState.files
    .flatMap((item) => filterWritable(item))
    .map(buildWriteInfo)
    .map(({ path, content }) => {
      return curriedWriteFile(path, content);
    });

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

export function buildWriteInfo(file: CkusroFile): WriteInfo {
  if (!file.isLoaded || file.content == null) {
    throw new Error('');
  }

  return {
    path: file.path,
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
