import { join } from 'path';
import {
  FileBuffer,
  FileBufferId,
  FileTypeRaw,
  replaceExt,
} from '../../../models/FileBuffer';
import { FileBuffersState } from '../../../models/FileBuffersState';
import { GlobalState } from '../../../models/GlobalState';
import { Namespace, namespaceMap } from '../../../models/Namespace';
import { WriteInfo } from '../../models/WriteInfo';
import { State } from './assets/modules';
import buildHTML from './buildHTML';
import filterFileBuffers from './filterFileBuffers';

export default async function staticRenderer(
  globalState: GlobalState,
  fileBuffersState: FileBuffersState,
): Promise<Array<WriteInfo | Error>> {
  const fileBuffers = filterFileBuffers(
    fileBuffersState.fileBuffers,
    globalState.namespaces,
  );
  console.log(fileBuffers);
  const nsMap = namespaceMap(globalState.namespaces);

  return fileBuffers
    .flatMap((fileBuffer) => {
      const newBuffer = getRenderedBuffer(fileBuffer, fileBuffersState);
      if (newBuffer.content == null) {
        return [];
      }

      return newBuffer;
    })
    .map((fileBuffer) => {
      const ns = nsMap[fileBuffer.namespace];
      const path = determineAbsolutePath(ns, fileBuffer);

      return {
        path,
        content: fileBuffer.content as string,
      };
    });
}

export function getRenderedBuffer(
  fileBuffer: FileBuffer,
  fileBuffersState: FileBuffersState,
): FileBuffer {
  const props = buildProps(fileBuffersState, fileBuffer.id);
  console.log(props);
  const content = buildHTML(props);
  const newPath = replaceExt(fileBuffer);

  return { ...fileBuffer, path: newPath, fileType: FileTypeRaw, content };
}

export function buildProps(
  fileBuffersState: FileBuffersState,
  id: FileBufferId,
): State {
  return {
    common: {
      parserInstance: null as any,
    },
    fileBuffers: {
      fileBuffersState,
      currentFileBufferId: id,
    },
  };
}

export function determineAbsolutePath(
  namespace: Namespace,
  fileBuffer: FileBuffer,
): string {
  const outputDir = namespace.outputContext.path;
  if (!outputDir.startsWith('/')) {
    throw new Error('Namespace.outputContext.path must start with `/`');
  }
  const filePath = fileBuffer.path;
  if (!filePath.startsWith('/')) {
    throw new Error('FileBuffer.path must start with `/`');
  }

  return join(outputDir, filePath);
}
