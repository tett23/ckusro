import * as Git from 'isomorphic-git';
import FS from 'fs';
import {
  RepoPath,
  CkusroConfig,
  BlobWriteInfo,
  TreeObject,
  isTreeObject,
  createRepoPath,
} from '../../src';
import { initRepository } from '../../src/Stage/prepare';
import {
  toIsomorphicGitConfig,
  stageIsomorphicGitConfig,
  IsomorphicGitConfig,
} from '../../src/models/IsomorphicGitConfig';
import { pfs } from '../__helpers__';
import { repository, Repository } from '../../src/Repository';
import stage, { Stage } from '../../src/Stage';
import { writeObject } from '../../src/RepositoryPrimitives/writeObject';
import { RepositoryPrimitives } from '../../src/RepositoryPrimitives';
import primitiveAdd from '../../src/RepositoryPrimitives/commands/add';
import { join } from 'path';

type BlobContentLike = Buffer | string;

type DummyCommit = Record<
  string,
  Record<string, BlobContentLike> | BlobContentLike
>;

type DummyRepositoryOptions = {
  fs: typeof FS;
  initialCommit: DummyCommit | null;
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
  options: Partial<DummyRepositoryOptions>,
): Promise<DummyRepositoryResult | Error> {
  const { fs, initialCommit } = {
    ...dummyRepositoryDefaultOptions(),
    ...options,
  };
  const isoConfig = toIsomorphicGitConfig(config, repoPath);
  const core = Git.cores.create(isoConfig.core);
  core.set('fs', fs);

  await initRepository(isoConfig);

  const repo = repository(isoConfig, repoPath);
  const rootTree = await writeObject(isoConfig, { type: 'tree', content: [] });
  if (rootTree instanceof Error) {
    return rootTree;
  }
  const commit = await repo.commit(rootTree, 'init');
  if (commit instanceof Error) {
    return commit;
  }
  const writeRefResult = await repo.writeRef('HEAD', commit, {
    force: true,
  });
  if (writeRefResult instanceof Error) {
    return writeRefResult;
  }

  if (initialCommit != null) {
    const commitResult = await buildCommit(repo, initialCommit);
    if (commitResult instanceof Error) {
      return commitResult;
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
  options: Partial<
    Omit<DummyRepositoryOptions, 'initialCommit'> & {
      initialCommit: Array<[RepoPath, DummyCommit]>;
    }
  >,
): Promise<DummyStageResult | Error> {
  const { fs, initialCommit } = {
    ...{ fs: pfs(), initialCommit: null },
    ...options,
  };
  const isoConfig = stageIsomorphicGitConfig(config);
  const core = Git.cores.create(isoConfig.core + 'aa');
  core.set('fs', fs);

  const repo = await stage(config, fs);
  if (repo instanceof Error) {
    throw new Error('');
  }

  if (initialCommit != null) {
    const ic = initialCommit
      .map(
        ([repoPath, dummyCommit]: [RepoPath, DummyCommit]): DummyCommit =>
          flatDummyCommit(createRepoPath(repoPath).join(), dummyCommit),
      )
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    const commitResult = await buildCommit(
      {
        commit: repo.commit,
        headTreeObject: repo.headTreeObject,
        add: (a: TreeObject, b: BlobWriteInfo) => primitiveAdd(isoConfig, a, b),
      },
      ic,
    );
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
  repo: Pick<RepositoryPrimitives, 'commit' | 'headTreeObject' | 'add'>,
  commit: DummyCommit,
): Promise<true | Error> {
  if (Object.keys(commit).length === 0) {
    return true;
  }

  const root = await repo.headTreeObject();
  if (root instanceof Error) {
    return root;
  }

  const addResult = await Object.entries(flatDummyCommit('', commit))
    .filter((item): item is [string, string | Buffer] =>
      isBlobContentLike(item[1]),
    )
    .map(
      ([path, content]): BlobWriteInfo => ({
        type: 'blob',
        path,
        content: typeof content === 'string' ? Buffer.from(content) : content,
      }),
    )
    .reduce(async (acc: Promise<TreeObject | Error>, item): Promise<
      TreeObject | Error
    > => {
      const left = await acc;
      if (left instanceof Error) {
        return left;
      }

      const addResult = await repo.add(left, item);
      if (addResult instanceof Error) {
        return addResult;
      }

      const [[, ret]] = addResult;
      if (!isTreeObject(ret)) {
        return new Error();
      }

      return ret;
    }, Promise.resolve(root));
  if (addResult instanceof Error) {
    return addResult;
  }

  const result = await repo.commit(addResult, 'initial commit');
  if (result instanceof Error) {
    return result;
  }

  return true;
}

function dummyRepositoryDefaultOptions(): DummyRepositoryOptions {
  return {
    fs: pfs(),
    initialCommit: null,
  };
}

function flatDummyCommit(
  pathPrefix: string,
  dummyCommit: DummyCommit,
): DummyCommit {
  return Object.entries(dummyCommit).reduce(
    (acc: DummyCommit, [path, content]) => ({
      ...acc,
      ...(isBlobContentLike(content)
        ? { [join(pathPrefix, path)]: content }
        : flatDummyCommit(pathPrefix, content)),
    }),
    {},
  );
}

function isBlobContentLike(obj: unknown): obj is BlobContentLike {
  return typeof obj === 'string' || obj instanceof Buffer;
}
