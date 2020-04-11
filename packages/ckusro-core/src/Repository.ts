import FS from 'fs';
import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from './models/IsomorphicGitConfig';
import repositoryPrimitives from './RepositoryPrimitives';
import headOid from './RepositoryPrimitives/headOid';
import { dirname } from 'path';
import lsFilesByRef from './RepositoryPrimitives/lsFilesByRef';
import { RepoPath } from './models/RepoPath';
import { InternalPathEntry } from './models/InternalPathEntry';
import { httpClient } from './utils/httpClient';

export type Repository = ReturnType<typeof repository>;

export function repository(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  repoPath: RepoPath,
) {
  return {
    ...repositoryPrimitives(fs, config),
    fetch: (ref?: string) => fetch(fs, config, ref),
    pull: () => pull(fs, config),
    checkout: (ref: string) => checkout(fs, config, ref),
    lsFiles: () => lsFiles(fs, config, repoPath),
    config: () => config,
  };
}

export async function fetch(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  ref?: string,
): Promise<true | Error> {
  const result = await Git.fetch({
    ...config,
    fs,
    http: httpClient(),
    corsProxy: config.corsProxy || undefined,
    ref: ref || 'master',
    singleBranch: true,
    onAuth: () =>
      ({
        oauth2format: 'github',
        token: config.authentication.github,
      } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  if (result.fetchHead == null) {
    return true;
  }

  const checkoutResult = await checkout(fs, config, result.fetchHead);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return true;
}

export async function pull(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  const result = await fetch(fs, config);
  if (result instanceof Error) {
    return result;
  }

  return headOid(fs, config);
}

export async function checkout(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  ref: string,
): Promise<void | Error> {
  const checkoutResult = await Git.checkout({
    ...config,
    fs,
    dir: dirname(config.gitdir),
    ref,
  }).catch((err: Error) => err);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return;
}

export async function lsFiles(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  repoPath: RepoPath,
): Promise<InternalPathEntry[] | Error> {
  const lsResult = await lsFilesByRef(fs, config, 'HEAD');
  if (lsResult instanceof Error) {
    return lsResult;
  }

  return lsResult.map(([path, treeEntry]) => {
    const internalPath = {
      repoPath,
      path,
    };

    return [internalPath, treeEntry] as const;
  });
}
