import { buildTreeEntry } from '../__fixtures__';
import updateOrAppendTreeEntries from '../../src/RepositoryPrimitives/updateOrAppendTreeEntries';

describe(updateOrAppendTreeEntries, () => {
  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const actual = updateOrAppendTreeEntries([], entry);

    expect(actual).toMatchObject([entry]);
  });

  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const appendItem = buildTreeEntry({ path: 'append' });
    const actual = updateOrAppendTreeEntries([entry], appendItem);

    expect(actual).toMatchObject([entry, appendItem]);
  });

  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const updateItem = { ...entry, oid: 'update' };
    const actual = updateOrAppendTreeEntries([entry], updateItem);

    expect(actual).toMatchObject([updateItem]);
  });

  it('returns same object', async () => {
    const entry = buildTreeEntry();
    const entries = [entry];
    const actual = updateOrAppendTreeEntries(entries, entry);

    expect(actual).toBe(entries);
  });
});
