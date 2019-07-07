import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { createWriteInfo } from '../../src/models/writeInfo';
import { buildInternalPath } from '../__fixtures__';
import { PathTreeObject } from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { TreeObject, CommitObject } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import commit from '../../src/Stage/commands/commit';
import writeRef from '../../src/RepositoryPrimitives/writeRef';
import headOid from '../../src/RepositoryPrimitives/headOid';
import add from '../../src/Stage/commands/add';

describe(writeRef, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns true', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const [[, newRoot]] = (await add(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const commitObject = (await commit(
      config,
      newRoot,
      'test',
    )) as CommitObject;

    const actual = await writeRef(config, 'HEAD', commitObject, {
      force: true,
    });
    expect(actual).toBe(true);

    const oid = (await headOid(config)) as string;
    expect(oid).toBe(commitObject.oid);
  });

  it('returns Error', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const [[, newRoot]] = (await add(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const commitObject = (await commit(
      config,
      newRoot,
      'test',
    )) as CommitObject;

    await writeRef(config, 'test', commitObject);
    const actual = await writeRef(config, 'test', commitObject);
    expect(actual).toBeInstanceOf(Error);
  });
});