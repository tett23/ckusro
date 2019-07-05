import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig, buildTreeEntry } from '../__fixtures__';
import { pfs } from '../__helpers__';
import {
  fetchOrCreateTreeByPath,
  appendOrUpdate,
  PathTreeObject,
} from '../../src/Stage/fetchOrCreateTreeByPath';

describe(fetchOrCreateTreeByPath, () => {
  const config = buildCkusroConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const actual = await fetchOrCreateTreeByPath(config, '/foo/bar/baz');

    expect((actual as PathTreeObject[]).length).toBe(4);
  });

  it('returns TreeObject', async () => {
    const actual = await fetchOrCreateTreeByPath(config, '/');

    expect((actual as PathTreeObject[]).length).toBe(1);
  });

  it('returns TreeObject when path does not normalized', async () => {
    const actual = await fetchOrCreateTreeByPath(config, '//foo/./bar/..');

    expect((actual as PathTreeObject[]).length).toBe(2);
  });
});

describe(appendOrUpdate, () => {
  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const actual = appendOrUpdate([], entry);

    expect(actual).toMatchObject([entry]);
  });

  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const appendItem = buildTreeEntry({ path: 'append' });
    const actual = appendOrUpdate([entry], appendItem);

    expect(actual).toMatchObject([entry, appendItem]);
  });

  it('returns TreeEntry[]', async () => {
    const entry = buildTreeEntry();
    const updateItem = { ...entry, oid: 'update' };
    const actual = appendOrUpdate([entry], updateItem);

    expect(actual).toMatchObject([updateItem]);
  });

  it('returns same object', async () => {
    const entry = buildTreeEntry();
    const entries = [entry];
    const actual = appendOrUpdate(entries, entry);

    expect(actual).toBe(entries);
  });
});
