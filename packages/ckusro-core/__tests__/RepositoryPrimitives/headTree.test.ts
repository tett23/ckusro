import FS from 'fs';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isTreeObject, TreeObject } from '../../src';

describe(headTree, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const actual = await headTree(fs, config);

    expect(isTreeObject(actual as TreeObject)).toBe(true);
  });
});
