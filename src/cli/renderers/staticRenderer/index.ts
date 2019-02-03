import { join, join as joinPath } from 'path';
import { curry } from 'ramda';
import { allDepdendencies } from '../../../models/DependencyTable';
import { FileBufferId, replaceExt } from '../../../models/FileBuffer';
import { FileBuffersState } from '../../../models/FileBuffersState';
import { GlobalState } from '../../../models/GlobalState';
import { namespaceMap } from '../../../models/Namespace';
import { OutputContext } from '../../../models/OutputContext';
import { WriteInfo } from '../../models/WriteInfo';
import { Props } from './assets/components';
import { filterFileBuffers } from './filterFileBuffers';
import render from './render';

export default async function staticRenderer(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<Array<WriteInfo | Error>> {
  return renderEachNamesace(globalState, fileBuffersState);
}

export async function renderEachNamesace(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<Array<WriteInfo | Error>> {
  const fileBuffers = filterFileBuffers(
    fileBuffersState.fileBuffers,
    globalState.namespaces,
  );

  const curriedBuildProps = curry(buildProps)(globalState, fileBuffersState);
  const nsMap = namespaceMap(globalState.namespaces);

  return fileBuffers.map(
    (fileBuffer): WriteInfo => {
      const props = curriedBuildProps(fileBuffer.id);
      const content = buildHTML(props);
      const ns = nsMap[fileBuffer.namespace];
      const path = join(ns.outputContext.path, fileBuffer.path);

      return {
        path,
        content,
      };
    },
  );
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
