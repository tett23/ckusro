import * as Git from 'isomorphic-git';
import { headOid } from '../../src/Stage/headTree';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchByOid } from '../../src/Stage/fetchByOid';

describe(fetchByOid, () => {
  const config = buildCkusroConfig();
  beforeEach(() => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
  });

  it('returns TreeObject', async () => {
    await initRepository(config);
    const oid = await headOid(config);
    const actual = await fetchByOid(config, oid as string);

    expect(actual).toMatchObject({
      oid: oid,
    });
  });

  it('returns null', async () => {
    await initRepository(config);
    const actual = await fetchByOid(config, 'aaaaaaaaaaaaaaaaaaaaa');

    expect(actual).toBe(null);
  });
});
