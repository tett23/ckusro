import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildCkusroConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import { fetchOrCreateTreeByPath } from '../../src/Stage/fetchOrCreateTreeByPath';
import { writeBlobByPath } from '../../src/Stage/writeBlobByPath';
import { PathTreeOrBlobObject } from '../../src/Stage/updateOrAppendTreeObject';
import { fetchByOid } from '../../src/Stage/fetchByOid';
import { BlobObject } from '../../src';

describe(writeBlobByPath, () => {
  const config = buildCkusroConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.coreId);
    const fs = pfs(config);
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns BlobObject', async () => {
    const actual = (await writeBlobByPath(
      config,
      '/foo/bar/baz.txt',
      new Buffer('test'),
    )) as PathTreeOrBlobObject[];

    expect(actual.length).toBe(4);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('test');
  });

  it('returns BlobObject', async () => {
    await writeBlobByPath(config, '/foo/bar/baz.txt', new Buffer('test'));

    const actual = (await writeBlobByPath(
      config,
      '/foo/bar/baz.txt',
      new Buffer('updated'),
    )) as PathTreeOrBlobObject[];

    expect(actual.length).toBe(4);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });

  it('returns BlobObject', async () => {
    const treeResult = await fetchOrCreateTreeByPath(
      config,
      '/foo/bar/baz.txt',
    );
    expect(treeResult).not.toBeInstanceOf(Error);

    const actual = (await writeBlobByPath(
      config,
      '/foo/bar/baz.txt',
      new Buffer('updated'),
    )) as PathTreeOrBlobObject[];

    expect(actual.length).toBe(4);

    const content = ((await fetchByOid(
      config,
      actual[actual.length - 1][1].oid,
    )) as BlobObject).content;
    expect(content.toString()).toBe('updated');
  });
});
