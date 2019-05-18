import { FileBuffer } from '.';
import { isNonNullObject, isPropertyValidTypeOf } from '../../core/utils/types';

export const FileBufferTypeLeaf: 'FileBuffer::Leaf' = 'FileBuffer::Leaf';

export type LeafFileBuffer = FileBuffer & {
  _type: typeof FileBufferTypeLeaf;
};

export function isFileBufferTypeLeaf(
  value: unknown,
): value is typeof FileBufferTypeLeaf {
  return typeof value === 'string' && value === FileBufferTypeLeaf;
}

export function isLeafFileBuffer(obj: unknown): obj is LeafFileBuffer {
  if (!isNonNullObject(obj)) {
    return false;
  }

  return isPropertyValidTypeOf(
    obj as LeafFileBuffer,
    '_type',
    isFileBufferTypeLeaf,
  );
}

export function filterLeafFileBuffer(
  fileBuffers: FileBuffer[],
): LeafFileBuffer[] {
  return fileBuffers.flatMap<LeafFileBuffer>((buf) =>
    isLeafFileBuffer(buf) ? buf : [],
  );
}
