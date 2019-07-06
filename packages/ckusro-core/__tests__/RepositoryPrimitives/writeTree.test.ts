import * as Git from 'isomorphic-git';
import { initRepository } from '../../src/Stage/prepare';
import {
  buildInternalPath,
  buildTreeEntry,
  randomOid,
  buildIsomorphicGitConfig,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import { writeTree } from '../../src/RepositoryPrimitives/writeTree';
import { fetchByOid } from '../../src/RepositoryPrimitives/fetchByOid';
import { TreeObject } from '../../src/models/GitObject';
import { createWriteInfo } from '../../src/models/writeInfo';
import { PathTreeObject } from '../../src/RepositoryPrimitives/updateOrAppendObject';
import { createInternalPath } from '../../src';
import { headTree } from '../../src/RepositoryPrimitives/headTree';

describe(writeTree, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo('tree', buildInternalPath(), []);
    const actual = (await writeTree(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const expectedPath = createInternalPath(writeInfo.internalPath)
      .flat()
      .split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expectedPath);

    const actualOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(config, actualOid)) as TreeObject;
    expect(leaf.oid).toBe(actualOid);
    expect(leaf.content).toMatchObject(writeInfo.content);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(config)) as TreeObject;
    const writeInfo = createWriteInfo('tree', buildInternalPath(), [
      buildTreeEntry(),
    ]);
    const actual = (await writeTree(
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject(writeInfo.content);
  });

  it('returns PathTreeObject[] when append TreeEntry', async () => {
    const root = (await headTree(config)) as TreeObject;
    const internalPath = buildInternalPath();
    const currentTreeEntries = [buildTreeEntry({ path: 'foo' })];
    const firstWriteResult = (await writeTree(
      config,
      root,
      createWriteInfo('tree', internalPath, currentTreeEntries),
    )) as PathTreeObject[];
    const [[, newRoot]] = firstWriteResult;

    const updateTreeEntries = [buildTreeEntry()];
    const writeInfo = createWriteInfo('tree', internalPath, updateTreeEntries);
    const actual = (await writeTree(
      config,
      newRoot,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject([
      ...currentTreeEntries,
      ...updateTreeEntries,
    ]);
  });

  it('returns PathTreeObject[] when update TreeEntry', async () => {
    const root = (await headTree(config)) as TreeObject;
    const internalPath = buildInternalPath();
    const currentTreeEntries = [
      buildTreeEntry({ oid: randomOid(), path: 'foo' }),
    ];
    const firstWriteResult = (await writeTree(
      config,
      root,
      createWriteInfo('tree', internalPath, currentTreeEntries),
    )) as PathTreeObject[];
    const [[, newRoot]] = firstWriteResult;

    const updateTreeEntries = [{ ...currentTreeEntries[0], oid: randomOid() }];
    const writeInfo = createWriteInfo('tree', internalPath, updateTreeEntries);
    const actual = (await writeTree(
      config,
      newRoot,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject([...updateTreeEntries]);
  });
});
