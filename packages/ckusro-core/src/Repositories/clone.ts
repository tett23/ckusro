import * as Git from 'isomorphic-git';
import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { RepoPath, toPath, url2RepoPath } from '../models/RepoPath';
import { Repository, repository } from '../Repository';
import { toIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import mkdirP from '../utils/mkdirP';
import rmrf from '../utils/rmrf';
import isCloned from './internal/isCloned';
import { httpClient } from '../utils/httpClient';

export default async function clone(
  fs: typeof FS,
  config: CkusroConfig,
  url: string,
): Promise<Repository | Error> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const clearResult = await clearRepositoryDirectory(config, fs, repoPath);
  if (clearResult instanceof Error) {
    return clearResult;
  }

  const gitConfig = toIsomorphicGitConfig(config, repoPath);
  const result = await (async () =>
    Git.clone({
      ...gitConfig,
      corsProxy: config.corsProxy || undefined,
      fs,
      http: httpClient(),
      dir: toPath(config.base, repoPath),
      url,
      singleBranch: true,
      depth: 1,
      noCheckout: true,
      onAuth: () =>
        ({
          oauth2format: 'github',
          token: config.authentication.github,
        } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    }))().catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  const repo = repository(fs, gitConfig, repoPath);
  const checkoutResult = await repo.checkout('origin/master');
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return repo;
}

async function clearRepositoryDirectory(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<true | Error> {
  const dirPath = toPath(config.base, repoPath);
  const isExist = await isCloned(config, fs, repoPath);
  if (isExist) {
    const rmrfResult = await rmrf(fs, dirPath);
    if (rmrfResult instanceof Error) {
      return rmrfResult;
    }
  }

  const mkdirResult = mkdirP(fs, dirPath);
  if (mkdirResult instanceof Error) {
    return mkdirResult;
  }

  return true;
}
