import { TreeEntry, BlobTreeEntry, TreeTreeEntry } from './TreeEntry';
import { PathTreeOrBlobObject } from './PathTreeObject';
import { toTreeEntry } from './GitObject';

export type PathTreeEntry = readonly [string, TreeEntry];
export type BlobPathTreeEntry = readonly [string, BlobTreeEntry];
export type TreePathTreeEntry = readonly [string, TreeTreeEntry];

export function toPathTreeEntry([path, obj]: PathTreeOrBlobObject): readonly [
  string,
  TreeEntry,
] {
  return [path, toTreeEntry(path, obj)];
}
