import * as Git from 'isomorphic-git';
import {
  buildRepoPath,
  buildCkusroConfig,
  buildInternalPath,
} from '../../__fixtures__';
import reconcileWithStageTree from '../../../src/ReconcileWithStage/internal/reconcileWithStageTree';
import {
  buildDummyRepository,
  buildDummyStage,
} from '../../__fixtures__/buildDummyRepository';
import { pfs } from '../../__helpers__';

describe(reconcileWithStageTree, () => {
  const config = buildCkusroConfig();

  it('returns GitObject', async () => {
    const fs = pfs();
    const internalPath = buildInternalPath({ path: '/foo/bar/baz' });
    const repoPath = internalPath.repoPath;
    const repo = await buildDummyRepository(config, repoPath, {
      fs,
      initialCommit: { '/foo/bar/baz': '' },
    });
    if (repo instanceof Error) {
      throw repo;
    }
    const stage = await buildDummyStage(config, {
      fs,
      initialCommit: [[repoPath, { '/foo/bar/baz': '' }]],
    });
    if (stage instanceof Error) {
      throw stage;
    }
    console.log(await fs.promises.readdir('/stage'));

    const actual = await reconcileWithStageTree(
      config,
      repo.repository,
      stage.repository,
      internalPath,
    );
    console.log(actual);
  });
});
