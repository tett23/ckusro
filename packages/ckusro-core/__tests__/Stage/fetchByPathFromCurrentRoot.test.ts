import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isBlobObject, GitObject } from '../../src';
import fetchByPathFromCurrentRoot from '../../src/Stage/fetchByPathFromCurrentRoot';

describe(fetchByPathFromCurrentRoot, () => {
  const config = buildCkusroConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const actual = await fetchByPathFromCurrentRoot(config, '/.gitkeep');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });

  it('returns null', async () => {
    const actual = await fetchByPathFromCurrentRoot(config, '/does_not_exist');

    expect(actual).toBe(null);
  });
});
