import { TreeEntry, compareTreeEntry } from '../models/GitObject';

export default function updateOrAppendTreeEntries(
  entries: TreeEntry[],
  entry: TreeEntry,
): TreeEntry[] {
  const idx = entries.findIndex((item) => item.path === entry.path);
  if (idx === -1) {
    return [...entries, entry];
  }
  if (compareTreeEntry(entries[idx], entry)) {
    return entries;
  }

  return [...entries.slice(0, idx), entry, ...entries.slice(idx + 1)];
}
