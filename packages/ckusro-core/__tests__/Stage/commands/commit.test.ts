import * as Git from 'isomorphic-git';
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
import commit from '../../../src/Stage/commands/commit';
import add from '../../../src/Stage/commands/add';
import { createGlobalWriteInfo } from '../../../src/models/GlobalWriteInfo';

describe(commit, () => {
  const config = buildIsomorphicGitConfig();
  beforeEach(async () => {
    const core = Git.cores.create(config.core);
    const fs = pfs();
    core.set('fs', fs);
    await initRepository(config);
  });

  it('returns CommitObject', async () => {
    const root = (await headTree(config)) as TreeObject;
    const globalWriteInfo = createGlobalWriteInfo(
      'blob',
      buildInternalPath({ path: '/foo/bar/baz.txt' }),
      Buffer.from('test', 'utf8'),
    );

    const addResult = (await add(
      config,
      root,
      globalWriteInfo,
    )) as InternalPathTreeObject[];
    const [[, newRoot]] = addResult as InternalPathTreeObject[];

    const actual = (await commit(config, newRoot, 'test')) as CommitObject;

    expect(isCommitObject(actual)).toBe(true);
  });
});
