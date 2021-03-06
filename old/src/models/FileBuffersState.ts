import {
  isArrayOf,
  isNonNullObject,
  isPropertyValidTypeOf,
} from '../core/utils/types';
import {
  buildDependencyTable,
  DependencyTable,
  invert,
  isDependencyTable,
} from './DependencyTable';
import { FileBuffer, isFileBuffer } from './FileBuffer';

export type FileBuffersState = {
  fileBuffers: FileBuffer[];
  dependencyTable: DependencyTable;
  invertedDependencyTable: DependencyTable;
};

export function isFileBufferState(value: unknown): value is FileBuffersState {
  if (!isNonNullObject(value)) {
    return false;
  }

  const isFileBuffers = (items: unknown): items is FileBuffer[] =>
    isArrayOf(items, isFileBuffer);

  const obj = value as FileBuffersState;

  return (
    isPropertyValidTypeOf(obj, 'fileBuffers', isFileBuffers) &&
    isPropertyValidTypeOf(obj, 'dependencyTable', isDependencyTable) &&
    isPropertyValidTypeOf(obj, 'invertedDependencyTable', isDependencyTable)
  );
}

export function newFileBuffersState(
  fileBuffers: FileBuffer[],
): FileBuffersState {
  const dependencyTable = buildDependencyTable(fileBuffers);

  return {
    fileBuffers,
    dependencyTable,
    invertedDependencyTable: invert(dependencyTable),
  };
}
