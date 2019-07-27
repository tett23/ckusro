import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from './models/IsomorphicGitConfig';
import repositoryPrimitives from './RepositoryPrimitives';
import headOid from './RepositoryPrimitives/headOid';
import { dirname } from 'path';
import lsFilesByRef from './RepositoryPrimitives/lsFilesByRef';
import { RepoPath } from './models/RepoPath';
import { InternalPathEntry } from './models/InternalPathEntry';

export type Repository = ReturnType<typeof repository>;

export function repository(config: IsomorphicGitConfig, repoPath: RepoPath) {
  return {
    ...repositoryPrimitives(config),
    fetch: (ref?: string) => fetch(config, ref),
    pull: () => pull(config),
    checkout: (ref: string) => checkout(config, ref),
    lsFiles: () => lsFiles(config, repoPath),
  };
}

export async function fetch(
  config: IsomorphicGitConfig,
  ref?: string,
): Promise<true | Error> {
  const result = await Git.fetch({
    ...config,
    corsProxy: config.corsProxy || undefined,
    token: config.authentication.github || undefined,
    ref: ref || 'master',
    singleBranch: true,
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  if (result.fetchHead == null) {
    return true;
  }

  const checkoutResult = await checkout(config, result.fetchHead);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return true;
}

export async function pull(
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  const result = await fetch(config);
  if (result instanceof Error) {
    return result;
  }

  return headOid(config);
}

export async function checkout(
  config: IsomorphicGitConfig,
  ref: string,
): Promise<void | Error> {
  const checkoutResult = await Git.checkout({
    ...config,
    dir: dirname(config.gitdir),
    ref,
  }).catch((err: Error) => err);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return;
}

export async function lsFiles(
  config: IsomorphicGitConfig,
  repoPath: RepoPath,
): Promise<InternalPathEntry[] | Error> {
  const lsResult = await lsFilesByRef(config, 'HEAD');
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
