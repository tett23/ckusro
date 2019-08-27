import { TreeEntry } from '../TreeEntry';

export default function sortTreeEntries(entries: TreeEntry[]): TreeEntry[] {
  return entries.sort(comparePath);
}

// original implementation
// https://github.com/isomorphic-git/isomorphic-git/blob/6518bf12ddf66e3987c2a7c7720637f230bc3e92/src/utils/comparePath.js#L3
export function comparePath(a: TreeEntry, b: TreeEntry) {
  return compareStrings(a.path, b.path);
}

export function compareStrings(a: string, b: string) {
  return -(a < b) || +(a > b);
}
