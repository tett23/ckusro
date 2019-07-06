import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import { buildTreeEntry, buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import updateOrAppendObject, {
  PathTreeObject,
} from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { fetchOrCreateTreeByPath } from '../../src/RepositoryPrimitives/fetchOrCreateTreeByPath';
import { writeObject } from '../../src/RepositoryPrimitives/writeObject';
import { TreeObject, BlobObject } from '../../src';
import { headTree } from '../../src/RepositoryPrimitives/headTree';

describe(updateOrAppendObject, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns TreeEntry[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const parents = (await fetchOrCreateTreeByPath(
      config,
      root,
      '/',
    )) as PathTreeObject[];
    const blob = (await writeObject(config, {
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
    const treeObject = (await writeObject(config, {
      type: 'tree',
      content: tree,
    })) as TreeObject;
    const actual = (await updateOrAppendObject(config, parents, [
      'bar',
      treeObject,
    ])) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'bar']);
  });

  it('returns TreeEntry[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const parents = (await fetchOrCreateTreeByPath(
      config,
      root,
      '/',
    )) as PathTreeObject[];
    const blob = (await writeObject(config, {
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
    const treeObject = (await writeObject(config, {
      type: 'tree',
      content: tree,
    })) as TreeObject;
    await updateOrAppendObject(config, parents, ['bar', treeObject]);

    const newBlob = (await writeObject(config, {
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
    const newTreeObject = (await writeObject(config, {
      type: 'tree',
      content: newTree,
    })) as TreeObject;

    const actual = (await updateOrAppendObject(config, parents, [
      'bar',
      newTreeObject,
    ])) as PathTreeObject[];

    expect(actual.map(([item]) => item)).toMatchObject(['', 'bar']);
  });
});
