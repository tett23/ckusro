import { TreeEntry } from 'isomorphic-git';

export type TreeEntry = TreeEntry;

export type BlobTreeEntry = TreeEntry & {
  type: 'blob';
};

export type TreeTreeEntry = TreeEntry & {
  type: 'tree';
};

export function isTreeEntry(entry: TreeEntry): entry is TreeTreeEntry {
  return entry.type === 'tree';
}

export function isBlobEntry(entry: TreeEntry): entry is BlobTreeEntry {
  return entry.type === 'blob';
}
