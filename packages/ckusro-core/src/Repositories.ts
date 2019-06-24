import FS from 'fs';
import * as Git from 'isomorphic-git';
import rimraf from 'rimraf';
import { join } from 'path';
import { CkusroConfig } from './models/CkusroConfig';
import { GitObject } from './models/GitObject';
import { gitDir, RepoPath, toPath, url2RepoPath } from './models/RepoPath';
import {
  fetchObject as repositoryFetchObject,
  headOid,
  Repository,
  repository,
} from './Repository';
import { promisify, callbackify } from 'util';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(config: CkusroConfig, fs: typeof FS) {
  return {
    clone: (url: string) => clone(config, fs, url),
    allRepositories: () => allRepositories(config, fs),
    fetchRepository: (repoPath: RepoPath) =>
      fetchRepository(config, fs, repoPath),
    fetchObject: (oid: string) => fetchObject(config, fs, oid),
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

  const result = await (async () => {
    await Git.clone({
      core: config.coreId,
      corsProxy: config.corsProxy || undefined,
      token: config.authentication.github || undefined,
      dir: dirPath,
      url,
      singleBranch: true,
      depth: 2,
    });
  })().catch((err) => err);
  if (result instanceof Error) {
    return result;
  }

  const checkoutResult = await Git.checkout({
    core: config.coreId,
    dir: dirPath,
    ref: 'origin/master',
  }).catch((err: Error) => err);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return repository(config, repoPath);
}

export async function allRepositories(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<RepoPath[] | Error> {
  const domains = await readdir(fs, config.base);
  if (domains instanceof Error) {
    return domains;
  }

  const ps = domains.map(async (domain) => {
    const users = await readdir(fs, join(config.base, domain));
    if (users instanceof Error) {
      return users;
    }

    const usersPs = users.map(async (user) => {
      const names = await readdir(fs, join(config.base, domain, user));
      if (names instanceof Error) {
        return names;
      }

      return names.map((name) => ({
        domain,
        user,
        name,
      }));
    });

    return Promise.all(usersPs);
  });

  const ret: Array<RepoPath | Error> = (await Promise.all(ps)).flat(3) as any;
  const errorIndex = ret.findIndex((item) => item instanceof Error);
  if (errorIndex !== -1) {
    return ret[errorIndex] as Error;
  }

  return ret as RepoPath[];
}

async function readdir(fs: typeof FS, path: string): Promise<string[] | Error> {
  return await (async () => fs.promises.readdir(path))().catch(
    (err: Error) => err,
  );
}

export async function fetchRepository(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<Repository | Error> {
  const isExist = await fs.promises
    .stat(gitDir(config.base, repoPath))
    .catch((err: Error) => err);
  if (isExist instanceof Error) {
    return isExist;
  }

  return repository(config, repoPath);
}

export async function fetchObject(
  config: CkusroConfig,
  fs: typeof FS,
  oid: string,
): Promise<GitObject | Error> {
  const repoPaths = await allRepositories(config, fs);
  if (repoPaths instanceof Error) {
    return repoPaths;
  }

  const ps = repoPaths.map(async (repoPath) =>
    repositoryFetchObject(config, repoPath, oid),
  );
  const ret = (await Promise.all(ps)).find((item) => !(item instanceof Error));
  if (ret == null || ret instanceof Error) {
    return new Error(`Object not found. oid=${oid}`);
  }

  return ret;
}

export async function headOids(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<Array<[string, RepoPath]> | Error> {
  const repositories = await allRepositories(config, fs);
  if (repositories instanceof Error) {
    return repositories;
  }

  const ps = repositories.map(async (repoPath) => {
    const oid = await headOid(config, repoPath);
    if (oid instanceof Error) {
      return oid;
    }

    return [oid, repoPath] as const;
  });

  const headOids = await Promise.all(ps);
  const errorIndex = headOids.findIndex((item) => item instanceof Error);
  if (errorIndex !== -1) {
    return headOids[errorIndex] as Error;
  }

  return headOids as Array<[string, RepoPath]>;
}
