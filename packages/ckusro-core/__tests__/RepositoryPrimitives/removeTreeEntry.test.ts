import { buildTreeEntry } from '../__fixtures__';
import updateOrAppendTreeEntries from '../../src/RepositoryPrimitives/updateOrAppendTreeEntries';
import removeTreeEntry from '../../src/RepositoryPrimitives/removeTreeEntry';
import { TreeEntry } from '../../src';

describe(updateOrAppendTreeEntries, () => {
  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const entries = [entry];
    const actual = removeTreeEntry(entries, entry.path) as TreeEntry[];

    expect(actual.length).toBe(0);
  });

  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const actual = removeTreeEntry([], entry.path) as Error;

    expect(actual).toBeInstanceOf(Error);
  });
});
