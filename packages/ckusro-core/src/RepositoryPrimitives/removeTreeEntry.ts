import { TreeEntry } from '../models/GitObject';

export default function removeTreeEntry(
  entries: TreeEntry[],
  entry: TreeEntry,
): TreeEntry[] | Error {
  const idx = entries.findIndex((item) => item.path === entry.path);
  if (idx === -1) {
    return new Error('');
  }

  return [...entries.slice(0, idx), ...entries.slice(idx + 1)];
}
