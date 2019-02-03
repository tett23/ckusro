import { dirname } from 'path';
import {
  FileBufferId,
  SingleNamespaceFileBuffer,
} from '../../../../../../models/FileBuffer';

export default function getAncestors<N>(
  fileBuffer: SingleNamespaceFileBuffer<N>,
  fileBuffers: Array<SingleNamespaceFileBuffer<N>>,
): Array<SingleNamespaceFileBuffer<N>> {
  const ids = parent(fileBuffer.path, fileBuffers).flat();

  return ids.flatMap((id) => {
    const ret = fileBuffers.find((item) => id === item.id);
    return ret ? ret : [];
  });
}

function parent<N>(
  path: string,
  fileBuffers: Array<SingleNamespaceFileBuffer<N>>,
): FileBufferId[] {
  if (path === '/') {
    return [];
  }

  const parentPath = dirname(path);
  const fb = fileBuffers.find((item) => item.path === parentPath);
  if (fb == null) {
    return [];
  }

  return [fb.id].concat(parent(parentPath, fileBuffers));
}
