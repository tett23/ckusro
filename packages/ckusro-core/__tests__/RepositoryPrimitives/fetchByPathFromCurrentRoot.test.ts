import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isBlobObject, GitObject } from '../../src';
import fetchByPathFromCurrentRoot from '../../src/RepositoryPrimitives/fetchByPathFromCurrentRoot';

describe(fetchByPathFromCurrentRoot, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const actual = await fetchByPathFromCurrentRoot(fs, config, '/.gitkeep');

    expect(isBlobObject(actual as GitObject)).toBe(true);
  });

  it('returns null', async () => {
    const actual = await fetchByPathFromCurrentRoot(
      fs,
      config,
      '/does_not_exist',
    );

    expect(actual).toBe(null);
  });
});
