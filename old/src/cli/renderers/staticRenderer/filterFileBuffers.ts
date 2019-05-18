import { FileBuffer, isWritableFileType } from '../../../models/FileBuffer';
import { Namespace } from '../../../models/Namespace';

export default function filterFileBuffers(
  fileBuffers: FileBuffer[],
  namespaces: Namespace[],
): FileBuffer[] {
  const filtered = filterNamespace(fileBuffers, namespaces);

  return filterWritable(filtered);
}

export function filterNamespace(
  fileBuffers: FileBuffer[],
  namespaces: Namespace[],
): FileBuffer[] {
  const nsNames = namespaces.map(({ name }) => name);

  return fileBuffers.filter(({ namespace }) => nsNames.includes(namespace));
}

export function filterWritable(fileBuffers: FileBuffer[]): FileBuffer[] {
  console.log(fileBuffers.map(({ content }) => content));
  return fileBuffers.filter(
    ({ fileType, content }) => content != null && isWritableFileType(fileType),
  );
}
