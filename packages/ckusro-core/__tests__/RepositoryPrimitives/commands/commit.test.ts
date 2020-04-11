import FS from 'fs';
import { initRepository } from '../../../src/Stage/prepare';
import {
  buildIsomorphicGitConfig,
  buildInternalPath,
} from '../../__fixtures__';
import { pfs } from '../../__helpers__';
import {
  TreeObject,
  CommitObject,
  isCommitObject,
  InternalPathTreeObject,
} from '../../../src';
import headTree from '../../../src/RepositoryPrimitives/headTree';
import commit from '../../../src/RepositoryPrimitives/commands/commit';
import add from '../../../src/Stage/commands/add';
import { createGlobalWriteInfo } from '../../../src/models/GlobalWriteInfo';

describe(commit, () => {
  const config = buildIsomorphicGitConfig();
  let fs: typeof FS;
  beforeEach(async () => {
    fs = pfs();
    await initRepository(fs, config);
  });

  it('returns CommitObject', async () => {
    const root = (await headTree(fs, config)) as TreeObject;
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      Buffer.from('test', 'utf8'),
    );

    const addResult = (await add(
      fs,
      config,
      root,
      globalWriteInfo,
    )) as InternalPathTreeObject[];
    const [[, newRoot]] = addResult as InternalPathTreeObject[];

    const actual = (await commit(fs, config, newRoot, 'test')) as CommitObject;

    expect(isCommitObject(actual)).toBe(true);
  });
});
