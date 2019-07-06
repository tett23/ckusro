import * as Git from 'isomorphic-git';
import { IsomorphicGitConfig } from './models/IsomorphicGitConfig';
import repositoryPrimitives from './RepositoryPrimitives';
import headOid from './RepositoryPrimitives/headOid';
import { dirname } from 'path';

export type Repository = ReturnType<typeof repository>;

export function repository(config: IsomorphicGitConfig) {
  return {
    ...repositoryPrimitives(config),
    fetch: (ref?: string) => fetch(config, ref),
    pull: () => pull(config),
    checkout: (ref: string) => checkout(config, ref),
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
