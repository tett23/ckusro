import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import {
  buildTreeEntry,
  randomOid,
  buildIsomorphicGitConfig,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import { writeTree } from '../../src/RepositoryPrimitives/writeTree';
import fetchByOid from '../../src/RepositoryPrimitives/fetchByOid';
import { TreeObject } from '../../src/models/GitObject';
import { createWriteInfo } from '../../src/models/writeInfo';
import { PathTreeObject } from '../../src/models/PathTreeObject';
import headTree from '../../src/RepositoryPrimitives/headTree';

describe(writeTree, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo('tree', '/test', []);
    const actual = (await writeTree(
      fs,
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const expectedPath = writeInfo.path.split('/');
    expect(actual.map(([item]) => item)).toMatchObject(expectedPath);

    const actualOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(fs, config, actualOid)) as TreeObject;
    expect(leaf.oid).toBe(actualOid);
    expect(leaf.content).toMatchObject(writeInfo.content);
  });

  it('returns PathTreeObject[]', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const writeInfo = createWriteInfo('tree', '/test', [buildTreeEntry()]);
    const actual = (await writeTree(
      fs,
      config,
      root,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(fs, config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject(writeInfo.content);
  });

  it('returns PathTreeObject[] when append TreeEntry', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const currentTreeEntries = [buildTreeEntry({ path: 'foo' })];
    const firstWriteResult = (await writeTree(
      fs,
      config,
      root,
      createWriteInfo('tree', '/test', currentTreeEntries),
    )) as PathTreeObject[];
    const [[, newRoot]] = firstWriteResult;

    const updateTreeEntries = [buildTreeEntry()];
    const writeInfo = createWriteInfo('tree', '/test', updateTreeEntries);
    const actual = (await writeTree(
      fs,
      config,
      newRoot,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(fs, config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject([
      ...currentTreeEntries,
      ...updateTreeEntries,
    ]);
  });

  it('returns PathTreeObject[] when update TreeEntry', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const currentTreeEntries = [
      buildTreeEntry({ oid: randomOid(), path: 'foo' }),
    ];
    const firstWriteResult = (await writeTree(
      fs,
      config,
      root,
      createWriteInfo('tree', '/test', currentTreeEntries),
    )) as PathTreeObject[];
    const [[, newRoot]] = firstWriteResult;

    const updateTreeEntries = [{ ...currentTreeEntries[0], oid: randomOid() }];
    const writeInfo = createWriteInfo('tree', '/test', updateTreeEntries);
    const actual = (await writeTree(
      fs,
      config,
      newRoot,
      writeInfo,
    )) as PathTreeObject[];

    const leafOid = actual[actual.length - 1][1].oid;
    const leaf = (await fetchByOid(fs, config, leafOid)) as TreeObject;
    expect(leaf.content).toMatchObject([...updateTreeEntries]);
  });
});
