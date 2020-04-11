import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { createWriteInfo } from '../../src/models/writeInfo';
import { PathTreeObject } from '../../src/models/PathTreeObject';
import { TreeObject, CommitObject } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import commit from '../../src/RepositoryPrimitives/commands/commit';
import writeRef from '../../src/RepositoryPrimitives/writeRef';
import headOid from '../../src/RepositoryPrimitives/headOid';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';

describe(writeRef, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns true', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );
    const [[, newRoot]] = (await writeBlob(
      fs,
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const commitObject = (await commit(
      fs,
      config,
      newRoot,
      'test',
    )) as CommitObject;

    const actual = await writeRef(fs, config, 'HEAD', commitObject, {
      force: true,
    });
    expect(actual).toBe(true);

    const oid = (await headOid(fs, config)) as string;
    expect(oid).toBe(commitObject.oid);
  });

  it('returns Error', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );
    const [[, newRoot]] = (await writeBlob(
      fs,
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const commitObject = (await commit(
      fs,
      config,
      newRoot,
      'test',
    )) as CommitObject;

    await writeRef(fs, config, 'test', commitObject);
    const actual = await writeRef(fs, config, 'test', commitObject);
    expect(actual).toBeInstanceOf(Error);
  });
});
