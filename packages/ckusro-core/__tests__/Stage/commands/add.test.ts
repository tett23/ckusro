import * as Git from 'isomorphic-git';
import { initRepository } from '../../../src/Stage/prepare';
import { buildCkusroConfig, buildTreeEntry } from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import add from '../../../src/Stage/commands/add';
import { createWriteInfo } from '../../../src/models/writeInfo';
import { buildInternalPath } from '../../__fixtures__';
import { PathTreeObject } from '../../../src/Stage/updateOrAppendObject';
import { createInternalPath, BlobObject, TreeObject } from '../../../src';
import { fetchByOid } from '../../../src/Stage/fetchByOid';
import { headTree } from '../../../src/Stage/headTree';

describe(add, () => {
  const config = buildCkusroConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );

    const actual = (await add(config, root, writeInfo)) as PathTreeObject[];
    const expected = createInternalPath(writeInfo.internalPath)
      .flat()
      .split('/');

    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });

  it('returns TreeObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'tree',
      buildInternalPath({ path: '/foo/bar' }),
      [buildTreeEntry()],
    );

    const actual = (await add(config, root, writeInfo)) as PathTreeObject[];
    const expected = createInternalPath(writeInfo.internalPath)
      .flat()
      .split('/');

    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as TreeObject).content;
    expect(content).toMatchObject(writeInfo.content);
  });
});
