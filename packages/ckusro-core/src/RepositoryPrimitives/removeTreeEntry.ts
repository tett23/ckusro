import { TreeEntry } from '../models/TreeEntry';

export default function removeTreeEntry(
  entries: TreeEntry[],
  name: string,
): TreeEntry[] | Error {
  const idx = entries.findIndex((item) => item.path === name);
  if (idx === -1) {
    return new Error('');
  }

  return [...entries.slice(0, idx), ...entries.slice(idx + 1)];
}
