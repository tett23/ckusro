import * as Git from 'isomorphic-git';
import headCommitObject from '../../src/RepositoryPrimitives/headCommitObject';
import { pfs } from '../__helpers__';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { initRepository } from '../../src/Stage/prepare';
import { isCommitObject, CommitObject } from '../../src';

describe(headCommitObject, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns CommitObject', async () => {
    const actual = (await headCommitObject(config)) as CommitObject;

    expect(isCommitObject(actual)).toBe(true);
  });
});
