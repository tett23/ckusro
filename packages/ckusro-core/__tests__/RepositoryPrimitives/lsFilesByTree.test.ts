import FS from 'fs';
import { initRepository } from '../../src/Stage/prepare';
import { buildIsomorphicGitConfig } from '../__fixtures__';
import { pfs } from '../__helpers__';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { TreeObject, createWriteInfo } from '../../src';
import { PathTreeObject } from '../../src/models/PathTreeObject';
import { writeBlob } from '../../src/RepositoryPrimitives/writeBlob';
import lsFilesByTree from '../../src/RepositoryPrimitives/lsFilesByTree';
import { PathTreeEntry } from '../../src/models/PathTreeEntry';

describe(lsFilesByTree, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns PathTreeEntry', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const globalWriteInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );

    const [[, newRoot]] = (await writeBlob(
      fs,
      config,
      root,
      globalWriteInfo,
    )) as PathTreeObject[];

    const actual = (await lsFilesByTree(
      fs,
      config,
      newRoot,
    )) as PathTreeEntry[];

    expect(actual.map(([item]) => item)).toMatchObject([
      '/',
      '/.gitkeep',
      '/foo',
      '/foo/bar',
      '/foo/bar/baz.txt',
    ]);
  });
});
