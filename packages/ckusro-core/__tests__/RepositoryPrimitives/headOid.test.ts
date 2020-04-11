import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import headOid from '../../src/RepositoryPrimitives/headOid';

describe(headOid, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns string', async () => {
    const actual = await headOid(fs, config);

    expect(typeof actual).toBe('string');
  });
});
