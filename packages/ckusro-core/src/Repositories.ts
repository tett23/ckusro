import FS from 'fs';
import * as Git from 'isomorphic-git';
import { join } from 'path';
import { CkusroConfig } from './models/CkusroConfig';
import { GitObject } from './models/GitObject';
import { RepoPath, toPath, url2RepoPath } from './models/RepoPath';
import {
  fetchObject as repositoryFetchObject,
  headOid,
  Repository,
  repository,
} from './Repository';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(
  config: CkusroConfig,
  coreId: string,
  fs: typeof FS,
) {
  return {
    clone: (url: string) => clone(coreId, config, url),
    allRepositories: () => allRepositories(config, fs),
    fetchObject: (oid: string) => fetchObject(config, coreId, fs, oid),
    headOids: () => headOids(config, coreId, fs),
  };
}

export async function clone(
  coreId: string,
  config: CkusroConfig,
  url: string,
): Promise<Repository | Error> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const result = await (async () => {
    await Git.clone({
      core: coreId,
      corsProxy: 'https://cors.isomorphic-git.org',
      dir: toPath(config.base, repoPath),
      url,
      singleBranch: true,
      depth: 1,
    });
  })().catch((err) => err);
  if (result instanceof Error) {
    return result;
  }

  return repository(config, coreId, repoPath);
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

export async function fetchObject(
  config: CkusroConfig,
  coreId: string,
  fs: typeof FS,
  oid: string,
): Promise<GitObject | Error> {
  const repoPaths = await allRepositories(config, fs);
  if (repoPaths instanceof Error) {
    return repoPaths;
  }

  const ps = repoPaths.map(async (repoPath) =>
    repositoryFetchObject(config, coreId, repoPath, oid),
  );
  const ret = (await Promise.all(ps)).find((item) => !(item instanceof Error));
  if (ret == null || ret instanceof Error) {
    return new Error(`Object not found. oid=${oid}`);
  }

  return ret;
}

export async function headOids(
  config: CkusroConfig,
  coreId: string,
  fs: typeof FS,
): Promise<Array<[string, RepoPath]> | Error> {
  const repositories = await allRepositories(config, fs);
  if (repositories instanceof Error) {
    return repositories;
  }

  const ps = repositories.map(async (repoPath) => {
    const oid = await headOid(config, coreId, repoPath);
    if (oid instanceof Error) {
      return oid;
    }

    return [oid, repoPath] as [string, RepoPath];
  });

  const headOids = await Promise.all(ps);
  const errorIndex = headOids.findIndex((item) => item instanceof Error);
  if (errorIndex !== -1) {
    return headOids[errorIndex] as Error;
  }

  return headOids as Array<[string, RepoPath]>;
}
