import FS from 'fs';
import headCommitObject from '../../src/RepositoryPrimitives/headCommitObject';
import { pfs } from '../__helpers__';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { initRepository } from '../../src/Stage/prepare';
import { isCommitObject, CommitObject } from '../../src';

describe(headCommitObject, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns CommitObject', async () => {
    const actual = (await headCommitObject(fs, config)) as CommitObject;

    expect(isCommitObject(actual)).toBe(true);
  });
});
