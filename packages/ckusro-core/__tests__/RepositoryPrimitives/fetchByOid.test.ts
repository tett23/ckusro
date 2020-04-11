import FS from 'fs';
import headOid from '../../src/RepositoryPrimitives/headOid';
import { initRepository } from '../../src/Stage/prepare';
import { randomOid, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import fetchByOid from '../../src/RepositoryPrimitives/fetchByOid';

describe(fetchByOid, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeObject', async () => {
    const oid = (await headOid(fs, config)) as string;
    const actual = await fetchByOid(fs, config, oid);

    expect(actual).toMatchObject({
      oid: oid,
    });
  });

  it('returns Error ', async () => {
    await initRepository(fs, config);
    const oid = (await headOid(fs, config)) as string;
    const actual = await fetchByOid(fs, config, oid, 'tag');

    expect(actual).toBeInstanceOf(Error);
  });

  it('returns null', async () => {
    await initRepository(fs, config);
    const actual = await fetchByOid(fs, config, randomOid());

    expect(actual).toBe(null);
  });
});
