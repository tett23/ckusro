import FS from 'fs';
import * as Git from 'isomorphic-git';
import rimraf from 'rimraf';
import { CkusroConfig } from './models/CkusroConfig';
import { GitObject } from './models/GitObject';
import { RepoPath, toPath, url2RepoPath } from './models/RepoPath';
import { Repository, repository } from './Repository';
import { promisify, callbackify } from 'util';
import { InternalPath } from './models/InternalPath';
import { toIsomorphicGitConfig } from './models/IsomorphicGitConfig';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(config: CkusroConfig, fs: typeof FS) {
  return {
    clone: (url: string) => clone(config, fs, url),
    allRepositories: () => allRepositories(config, fs),
    fetchRepository: (repoPath: RepoPath) =>
      fetchRepository(config, fs, repoPath),
    fetchObject: (oid: string) => fetchObject(config, fs, oid),
    fetchObjectByInternalPath: (internalPath: InternalPath) =>
      fetchObjectByInternalPath(config, fs, internalPath),
    headOids: () => headOids(config, fs),
  };
}

export async function clone(
  config: CkusroConfig,
  fs: typeof FS,
  url: string,
): Promise<Repository | Error> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const dirPath = toPath(config.base, repoPath);
  const rmrfResult = await promisify(rimraf)(dirPath, {
    ...fs,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lstat: callbackify(fs.promises.stat) as any,
  }).catch((err: Error) => err);
  if (rmrfResult instanceof Error) {
    return rmrfResult;
  }
  const mkdirResult = await fs.promises
    .mkdir(dirPath, { recursive: true })
    .catch((err: Error) => err);
  if (mkdirResult instanceof Error) {
    return mkdirResult;
  }

  const gitConfig = toIsomorphicGitConfig(config, repoPath);
  const result = await (async () => {
    await Git.clone({
      ...gitConfig,
      corsProxy: config.corsProxy || undefined,
      token: config.authentication.github || undefined,
      dir: dirPath,
      url,
      singleBranch: true,
      depth: 2,
    });
  })().catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  const repo = repository(gitConfig);
  const checkoutResult = await repo.checkout('origin/master');
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return repo;
}

export async function allRepositories(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<Repository[] | Error> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    return fetchRepository(config, fs, repoPath);
  });
  const repos = await Promise.all(ps);

  const error = repos.find((item): item is Error => item instanceof Error);
  if (error != null) {
    return error;
  }

  return repos.filter((item): item is Repository => !(item instanceof Error));
}

export async function fetchRepository(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<Repository | Error> {
  const gitConfig = toIsomorphicGitConfig(config, repoPath);
  const isExist = await (async () =>
    fs.promises.stat(gitConfig.gitdir))().catch((err: Error) => err);
  if (isExist instanceof Error) {
    return isExist;
  }

  return repository(gitConfig);
}

export async function fetchObject(
  config: CkusroConfig,
  fs: typeof FS,
  oid: string,
): Promise<GitObject | Error> {
  const repositories = await allRepositories(config, fs);
  if (repositories instanceof Error) {
    return repositories;
  }

  const ps = repositories.map((repo) => repo.fetchByOid(oid));
  const ret = (await Promise.all(ps)).find(
    (item): item is GitObject => !(item instanceof Error),
  );
  if (ret == null || ret instanceof Error) {
    return new Error(`Object not found. oid=${oid}`);
  }

  return ret;
}

export async function fetchObjectByInternalPath(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: InternalPath,
): Promise<GitObject | null | Error> {
  const repo = await fetchRepository(config, fs, internalPath.repoPath);
  if (repo instanceof Error) {
    return repo;
  }

  const root = await repo.headTreeObject();
  if (root instanceof Error) {
    return root;
  }

  return repo.fetchByPath(root, internalPath.path);
}

export async function headOids(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<Array<[string, RepoPath]> | Error> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    const repo = await fetchRepository(config, fs, repoPath);
    if (repo instanceof Error) {
      return repo;
    }

    const headOid = await repo.headOid();
    if (headOid instanceof Error) {
      return headOid;
    }

    return [headOid, repoPath] as const;
  });
  const headOids = await Promise.all(ps);

  const error = headOids.find((item): item is Error => item instanceof Error);
  if (error instanceof Error) {
    return error;
  }

  return headOids as Array<[string, RepoPath]>;
}
