import * as Git from 'isomorphic-git';
import { headOid, headTree } from '../../src/RepositoryPrimitives/headTree';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isTreeObject, TreeObject } from '../../src';

describe(headTree, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const actual = await headTree(config);

    expect(isTreeObject(actual as TreeObject)).toBe(true);
  });
});

describe(headOid, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns string', async () => {
    const actual = await headOid(config);

    expect(typeof actual).toBe('string');
  });
});
