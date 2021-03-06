import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { CommitObject } from '../../src';
import revParse from '../../src/RepositoryPrimitives/revParse';
import headCommitObject from '../../src/RepositoryPrimitives/headCommitObject';
import fetchObjectByRef from '../../src/RepositoryPrimitives/fetchObjectByRef';

describe(fetchObjectByRef, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns CommitObject', async () => {
    const actual = (await fetchObjectByRef(fs, config, 'HEAD')) as CommitObject;
    const expected = (await headCommitObject(fs, config)) as CommitObject;

    expect(actual.oid).toBe(expected.oid);
  });

  it('returns Error', async () => {
    const actual = (await revParse(fs, config, 'does_not_exist')) as Error;

    expect(actual).toBeInstanceOf(Error);
  });
});
