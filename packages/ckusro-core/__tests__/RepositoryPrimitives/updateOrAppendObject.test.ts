import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildTreeEntry, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import updateOrAppendObject from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { PathTreeObject } from '../../src/models/PathTreeObject';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { writeObject } from '../../src/RepositoryPrimitives/writeObject';
import { TreeObject, BlobObject } from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';

describe(updateOrAppendObject, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns TreeEntry[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const parents = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/',
    )) as PathTreeObject[];
    const blob = (await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer(''),
    })) as BlobObject;
    const tree: TreeObject['content'] = [
      buildTreeEntry({
        mode: '100644',
        path: '.gitkeep',
        oid: blob.oid,
        type: 'blob',
      }),
    ];
    const treeObject = (await writeObject(fs, config, {
      type: 'tree',
      content: tree,
    })) as TreeObject;
    const actual = (await updateOrAppendObject(fs, config, parents, [
      'bar',
      treeObject,
    ])) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'bar']);
  });

  it('returns TreeEntry[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const parents = (await fetchOrCreateTreeByPath(
      fs,
      config,
      root,
      '/',
    )) as PathTreeObject[];
    const blob = (await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer(''),
    })) as BlobObject;
    const tree: TreeObject['content'] = [
      buildTreeEntry({
        mode: '100644',
        path: '.gitkeep',
        oid: blob.oid,
        type: 'blob',
      }),
    ];
    const treeObject = (await writeObject(fs, config, {
      type: 'tree',
      content: tree,
    })) as TreeObject;
    await updateOrAppendObject(fs, config, parents, ['bar', treeObject]);

    const newBlob = (await writeObject(fs, config, {
      type: 'blob',
      content: new Buffer('new blob object'),
    })) as BlobObject;
    const newTree: TreeObject['content'] = [
      buildTreeEntry({
        mode: '100644',
        path: 'newBlob',
        oid: newBlob.oid,
        type: 'blob',
      }),
    ];
    const newTreeObject = (await writeObject(fs, config, {
      type: 'tree',
      content: newTree,
    })) as TreeObject;

    const actual = (await updateOrAppendObject(fs, config, parents, [
      'bar',
      newTreeObject,
    ])) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'bar']);
  });
});
