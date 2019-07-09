import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { CommitObject } from '../../src';
import revParse from '../../src/RepositoryPrimitives/revParse';
import headCommitObject from '../../src/RepositoryPrimitives/headCommitObject';

describe(revParse, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns CommitObject', async () => {
    const actual = (await revParse(config, 'HEAD')) as string;
    const expected = (await headCommitObject(config)) as CommitObject;

    expect(actual).toBe(expected.oid);
  });

  it('returns Error', async () => {
    const actual = (await revParse(config, 'does_not_exist')) as Error;

    expect(actual).toBeInstanceOf(Error);
  });
});
