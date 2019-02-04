import { FileBuffer } from '.';
import { isNonNullObject, isPropertyValidTypeOf } from '../../core/utils/types';

export const FileBufferTypeLeaf: 'FileBufferTypeLeaf' = 'FileBufferTypeLeaf';

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
