import * as Git from 'isomorphic-git';
import { headOid, headTree } from '../../src/Stage/head';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { isTreeObject, TreeObject } from '../../src';

describe(headTree, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const actual = await headTree(config);

    expect(isTreeObject(actual as TreeObject)).toBe(true);
  });
});

describe(headOid, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns string', async () => {
    await initRepository(config);
    const actual = await headOid(config);

    expect(typeof actual).toBe('string');
  });
});
