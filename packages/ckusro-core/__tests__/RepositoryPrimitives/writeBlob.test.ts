import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildInternalPath, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';
import {
  PathTreeOrBlobObject,
  PathTreeObject,
} from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { fetchByOid } from '../../src/RepositoryPrimitives/fetchByOid';
import { BlobObject, createInternalPath, TreeObject } from '../../src';
import { createWriteInfo, BlobWriteInfo } from '../../src/models/WriteInfo';
import { headTree } from '../../src/RepositoryPrimitives/headTree';

describe(writeBlob, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const actual = (await writeBlob(
      config,
      root,
      writeInfo,
    )) as PathTreeOrBlobObject[];

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

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('test', 'utf8'),
    );
    const treeResult = (await writeBlob(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];
    const [[, newRoot]] = treeResult;
    expect(treeResult).not.toBeInstanceOf(Error);

    const newWriteInfo: BlobWriteInfo = {
      ...writeInfo,
      content: new Buffer('updated'),
    };
    const actual = (await writeBlob(
      config,
      newRoot,
      newWriteInfo,
    )) as PathTreeOrBlobObject[];

    const expected = createInternalPath(writeInfo.internalPath)
      .flat()
      .split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const treeResult = (await fetchOrCreateTreeByPath(
      config,
      root,
      '/foo/bar/baz.txt',
    )) as PathTreeObject[];
    const [[, newRoot]] = treeResult;
    expect(treeResult).not.toBeInstanceOf(Error);

    const writeInfo = createWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      new Buffer('updated', 'utf8'),
    );

    const actual = (await writeBlob(
      config,
      newRoot,
      writeInfo,
    )) as PathTreeOrBlobObject[];

    const expected = createInternalPath(writeInfo.internalPath)
      .flat()
      .split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });
});
