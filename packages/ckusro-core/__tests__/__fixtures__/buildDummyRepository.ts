import FS from 'fs';
import { RepoPath, CkusroConfig, createRepoPath } from '../../src';
import { initRepository } from '../../src/Stage/prepare';
import {
  toIsomorphicGitConfig,
  stageIsomorphicGitConfig,
  IsomorphicGitConfig,
} from '../../src/models/IsomorphicGitConfig';
import { pfs } from '../__helpers__';
import { repository, Repository } from '../../src/Repository';
import stage, { Stage } from '../../src/Stage';
import { RepositoryPrimitives } from '../../src/RepositoryPrimitives';
import buildTreeFromTreeLike, {
  TreeContentLike,
} from '../../src/models/GitObject/buildTreeFromTreeLike';

type DummyRepositoryOptions = {
  fs: typeof FS;
  initialTree: TreeContentLike | null;
};

export type DummyRepositoryResult = {
  isoConfig: IsomorphicGitConfig;
  repoPath: RepoPath;
  fs: typeof FS;
  repository: Repository;
};

export type DummyStageResult = {
  isoConfig: IsomorphicGitConfig;
  fs: typeof FS;
  repository: Stage;
};

export async function buildDummyRepository(
  config: CkusroConfig,
  repoPath: RepoPath,
  options?: Partial<DummyRepositoryOptions>,
): Promise<DummyRepositoryResult | Error> {
  const { fs, initialTree } = {
    ...dummyRepositoryDefaultOptions(),
    ...options,
  };
  const isoConfig = toIsomorphicGitConfig(config, repoPath);

  const initResult = await initRepository(fs, isoConfig);
  if (initResult instanceof Error) {
    throw initResult;
  }
  const repo = repository(fs, isoConfig, repoPath);

  if (initialTree != null) {
    const commitResult = await buildCommit(repo, initialTree);
    if (commitResult instanceof Error) {
      throw commitResult;
    }
  }

  return {
    isoConfig,
    repoPath,
    fs,
    repository: repo,
  };
}

export async function buildDummyStage(
  config: CkusroConfig,
  options?: Partial<
    Omit<DummyRepositoryOptions, 'initiaTree'> & {
      initialTree: Array<[RepoPath, TreeContentLike]>;
    }
  >,
): Promise<DummyStageResult | Error> {
  const { fs, initialTree } = {
    ...{ fs: pfs(), initialTree: null },
    ...options,
  };
  const isoConfig = stageIsomorphicGitConfig(config);

  const repo = await stage(fs, config);
  if (repo instanceof Error) {
    throw new Error('');
  }

  if (initialTree != null) {
    const treeLike = initialTree
      .map(
        ([repoPath, treeLike]: [
          RepoPath,
          TreeContentLike,
        ]): TreeContentLike => ({
          [createRepoPath(repoPath).join()]: treeLike,
        }),
      )
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    const commitResult = await buildCommit(repo, treeLike);
    if (commitResult instanceof Error) {
      return commitResult;
    }
  }

  return {
    isoConfig,
    fs,
    repository: repo,
  };
}

async function buildCommit(
  repo: Pick<RepositoryPrimitives, 'commit' | 'batchWriteObjects' | 'writeRef'>,
  tree: TreeContentLike,
): Promise<true | Error> {
  if (Object.keys(tree).length === 0) {
    return true;
  }

  const buildResult = await buildTreeFromTreeLike(tree);
  if (buildResult instanceof Error) {
    return buildResult;
  }

  const { root, objects } = buildResult;
  const writeResult = await repo.batchWriteObjects(objects);
  if (writeResult instanceof Error) {
    return writeResult;
  }

  const commitResult = await repo.commit(root, 'initial commit');
  if (commitResult instanceof Error) {
    return commitResult;
  }

  const writeRefResult = await repo.writeRef('HEAD', commitResult, {
    force: true,
  });
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  return true;
}

function dummyRepositoryDefaultOptions(): DummyRepositoryOptions {
  return {
    fs: pfs(),
    initialTree: null,
  };
}
