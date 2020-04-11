import FS from 'fs';
import {
  buildIsomorphicGitConfig,
  buildRepoPath,
  buildInternalPath,
} from '../__fixtures__';
import { pfs } from '../__helpers__';
import lsFiles from '../../src/Stage/lsFiles';
import {
  TreeObject,
  CommitObject,
  InternalPathGitObject,
  InternalPathTreeObject,
} from '../../src';
import headTree from '../../src/RepositoryPrimitives/headTree';
import { createGlobalWriteInfo } from '../../src/models/GlobalWriteInfo';
import commit from '../../src/RepositoryPrimitives/commands/commit';
import add from '../../src/Stage/commands/add';
import { initRepository } from '../../src/Stage/prepare';

describe(lsFiles, () => {
  const config = buildIsomorphicGitConfig();
  const repoPath = buildRepoPath();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);

    const root = (await headTree(fs, config)) as TreeObject;
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt', repoPath }),
      Buffer.from('test', 'utf8'),
    );

    const addResult = (await add(
      fs,
      config,
      root,
      globalWriteInfo,
    )) as InternalPathGitObject[];
    const [[, newRoot]] = addResult as InternalPathTreeObject[];

    (await commit(fs, config, newRoot, 'test')) as CommitObject;
  });

  it('returns InternalPathEntry[]', async () => {
    const actual = await lsFiles(fs, config, [repoPath]);

    expect(actual).toMatchObject([
      [buildInternalPath({ path: '/', repoPath }), expect.anything()],
      [buildInternalPath({ path: '/foo', repoPath }), expect.anything()],
      [buildInternalPath({ path: '/foo/bar', repoPath }), expect.anything()],
      [
        buildInternalPath({ path: '/foo/bar/baz.txt', repoPath }),
        expect.anything(),
      ],
    ]);
  });
});
