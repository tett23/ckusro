import * as Git from 'isomorphic-git';
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
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns PathTreeEntry', async () => {
    const root = (await headTree(config)) as TreeObject;
    const globalWriteInfo = createWriteInfo(
      'blob',
      '/foo/bar/baz.txt',
      new Buffer('test', 'utf8'),
    );

    const [[, newRoot]] = (await writeBlob(
      config,
      root,
      globalWriteInfo,
    )) as PathTreeObject[];

    const actual = (await lsFilesByTree(config, newRoot)) as PathTreeEntry[];

    expect(actual.map(([item]) => item)).toMatchObject([
      '/',
      '/.gitkeep',
      '/foo',
      '/foo/bar',
      '/foo/bar/baz.txt',
    ]);
  });
});
