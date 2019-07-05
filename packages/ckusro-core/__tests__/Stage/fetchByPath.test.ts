import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isBlobObject, GitObject } from '../../src';
import { fetchByPath } from '../../src/Stage/fetchByPath';

describe(fetchByPath, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const actual = await fetchByPath(config, '/.gitkeep');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });

  it('returns null', async () => {
    await initRepository(config);
    const actual = await fetchByPath(config, '/does_not_exist');

    expect(actual).toBe(null);
  });

  it('returns TreeObject when path does not normalized', async () => {
    await initRepository(config);
    const actual = await fetchByPath(config, '/a/../.gitkeep////');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });
});
