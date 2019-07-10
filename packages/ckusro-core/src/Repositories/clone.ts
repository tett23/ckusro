import * as Git from 'isomorphic-git';
import FS from 'fs';
import rimraf from 'rimraf';
import { CkusroConfig } from '../models/CkusroConfig';
import { RepoPath, toPath, url2RepoPath } from '../models/RepoPath';
import { Repository, repository } from '../Repository';
import { promisify, callbackify } from 'util';
import { toIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import mkdirP from '../utils/mkdirP';
import isCloned from './internal/isCloned';

export default async function clone(
  config: CkusroConfig,
  fs: typeof FS,
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
      token: config.authentication.github || undefined,
      dir: toPath(config.base, repoPath),
      url,
      singleBranch: true,
      depth: 2,
      noCheckout: true,
    }))().catch((err: Error) => err);
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

async function clearRepositoryDirectory(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<true | Error> {
  const dirPath = toPath(config.base, repoPath);
  const isExist = await isCloned(config, fs, repoPath);
  if (isExist) {
    const rmrfResult = await (async () =>
      await promisify(rimraf)(dirPath, {
        ...fs,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lstat: callbackify(fs.promises.stat) as any,
      }))().catch((err: Error) => err);
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
