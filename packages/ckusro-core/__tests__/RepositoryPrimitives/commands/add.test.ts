import * as Git from 'isomorphic-git';
import { initRepository } from '../../../src/Stage/prepare';
import { buildTreeEntry, buildIsomorphicGitConfig } from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/RepositoryPrimitives/commands/add';
import { PathTreeObject } from '../../../src/models/PathTreeObject';
import { BlobObject, TreeObject, createWriteInfo } from '../../../src';
import fetchByOid from '../../../src/RepositoryPrimitives/fetchByOid';
import headTree from '../../../src/RepositoryPrimitives/headTree';

describe(add, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      Buffer.from('test', 'utf8'),
    );

    const actual = (await add(config, root, writeInfo)) as PathTreeObject[];
    const expected = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo('tree', '/foo/bar', [buildTreeEntry()]);

    const actual = (await add(config, root, writeInfo)) as PathTreeObject[];
    const expected = writeInfo.path.split('/');

    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as TreeObject).content;
    expect(content).toMatchObject(writeInfo.content);
  });
});
