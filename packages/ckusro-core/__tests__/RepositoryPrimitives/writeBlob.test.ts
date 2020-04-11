import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';
import {
  PathTreeOrBlobObject,
  PathTreeObject,
} from '../../src/models/PathTreeObject';
import fetchByOid from '../../src/RepositoryPrimitives/fetchByOid';
import { BlobObject, TreeObject } from '../../src';
import { createWriteInfo, BlobWriteInfo } from '../../src/models/WriteInfo';
import headTree from '../../src/RepositoryPrimitives/headTree';

describe(writeBlob, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );
    const actual = (await writeBlob(
      fs,
      config,
      root,
      writeInfo,
    )) as PathTreeOrBlobObject[];

    const expected = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      fs,
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );
    const treeResult = (await writeBlob(
      fs,
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
      fs,
      config,
      newRoot,
      newWriteInfo,
    )) as PathTreeOrBlobObject[];

    const expected = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      fs,
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });

  it('returns PathTreeOrBlobObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const treeResult = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/foo/bar/baz.txt',
    )) as PathTreeObject[];
    const [[, newRoot]] = treeResult;
    expect(treeResult).not.toBeInstanceOf(Error);

    const writeInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('updated', 'utf8'),
    );

    const actual = (await writeBlob(
      fs,
      config,
      newRoot,
      writeInfo,
    )) as PathTreeOrBlobObject[];

    const expected = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expected);

    const content = ((await fetchByOid(
      fs,
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });
});
