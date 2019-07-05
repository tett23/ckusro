import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { writeTree } from '../../src/Stage/writeTree';
import { headTree } from '../../src/Stage/head';
import { fetchByOid } from '../../src/Stage/fetchByOid';
import { TreeObject } from '../../src/models/GitObject';
import { updateOrAppendTreeEntry } from '../../src/Stage/fetchOrCreateTreeByPath';

describe(writeTree, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const root = await headTree(config);
    const actual = await writeTree(
      config,
      [['/', root as TreeObject]],
      'foo',
      [],
    );

    expect(typeof actual).toBe('string');

    const newRoot = await fetchByOid(config, actual as string);
    expect((newRoot as TreeObject).oid).toBe(actual);
    expect((newRoot as TreeObject).content.map((item) => item.path)).toContain(
      'foo',
    );
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    let root = await headTree(config);
    await writeTree(config, [['/', root as TreeObject]], 'foo', []);
    root = await headTree(config);
    const actual = await writeTree(
      config,
      [['/', root as TreeObject]],
      'bar',
      [],
    );

    const newRoot = await fetchByOid(config, actual as string);
    expect((newRoot as TreeObject).content.map((item) => item.path)).toContain(
      'foo',
    );
    expect((newRoot as TreeObject).content.map((item) => item.path)).toContain(
      'bar',
    );
  });
});

describe(updateOrAppendTreeEntry, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const root = headTree(config);
    const root = await updateOrAppendTreeEntry(config, [['.', root]], ['foo']);
    const actual = await writeTree(
      config,
      [['/', root as TreeObject]],
      'foo',
      [],
    );

    expect(typeof actual).toBe('string');

    const newRoot = await fetchByOid(config, actual as string);
    expect((newRoot as TreeObject).oid).toBe(actual);
    expect((newRoot as TreeObject).content.map((item) => item.path)).toContain(
      'foo',
    );
  });
});
