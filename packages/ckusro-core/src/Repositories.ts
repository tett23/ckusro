import FS from 'fs';
import * as Git from 'isomorphic-git';
import { join } from 'path';
import { CkusroConfig } from './models/CkusroConfig';
import { RepoPath, toPath, url2RepoPath } from './models/RepoPath';
import { Repository, repository } from './Repository';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(
  config: CkusroConfig,
  coreId: string,
  fs: typeof FS,
) {
  return {
    clone: (url: string) => clone(coreId, config, url),
    allRepositories: () => allRepositories(config, fs),
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
  return await (async () => fs.readdirSync(path))().catch((err: Error) => err);
}
