import * as Git from 'isomorphic-git';
import headOid from '../../src/RepositoryPrimitives/headOid';
import { initRepository } from '../../src/Stage/prepare';
import { randomOid, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import fetchByOid from '../../src/RepositoryPrimitives/fetchByOid';

describe(fetchByOid, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const oid = (await headOid(config)) as string;
    const actual = await fetchByOid(config, oid);

    expect(actual).toMatchObject({
      oid: oid,
    });
  });

  it('returns Error ', async () => {
    await initRepository(config);
    const oid = (await headOid(config)) as string;
    const actual = await fetchByOid(config, oid, 'tag');

    expect(actual).toBeInstanceOf(Error);
  });

  it('returns null', async () => {
    await initRepository(config);
    const actual = await fetchByOid(config, randomOid());

    expect(actual).toBe(null);
  });
});
