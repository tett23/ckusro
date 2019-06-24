import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import {
  BlobObject,
  CommitObject,
  GitObject,
  TreeObject,
} from './models/GitObject';
import { gitDir, RepoPath, toPath } from './models/RepoPath';

export type Repository = ReturnType<typeof repository>;

export function repository(config: CkusroConfig, repoPath: RepoPath) {
  return {
    headOid: () => headOid(config, repoPath),
    headCommitObject: () => headCommitObject(config, repoPath),
    headRootTree: () => headRootTree(config, repoPath),
    readTree: (oid: string) => readTree(config, repoPath, oid),
    fetch: (ref?: string) => fetch(config, repoPath, ref),
    pull: () => pull(config, repoPath),
    checkout: (ref: string) => checkout(config, repoPath, ref),
  };
}

export async function headOid(
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<string | Error> {
  const path = gitDir(config.base, repoPath);
  const headOid = await (async () =>
    Git.resolveRef({
      core: config.coreId,
      gitdir: path,
      ref: 'HEAD',
    }))().catch((err: Error) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}

export async function headCommitObject(
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<CommitObject | Error> {
  const oid = await headOid(config, repoPath);
  if (oid instanceof Error) {
    return oid;
  }

  const commit = await fetchObject(config, repoPath, oid);
  if (commit instanceof Error) {
    return commit;
  }
  if (commit.type !== 'commit') {
    return new Error('Invalid object type.');
  }

  return commit;
}

export async function headRootTree(
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<TreeObject | Error> {
  const commit = await headCommitObject(config, repoPath);
  if (commit instanceof Error) {
    return commit;
  }

  const tree = await fetchObject(config, repoPath, commit.content.tree);
  if (tree instanceof Error) {
    return tree;
  }
  if (tree.type !== 'tree') {
    return new Error('Invalid object type.');
  }

  return tree;
}

export async function readTree(
  config: CkusroConfig,
  repoPath: RepoPath,
  oid: string,
): Promise<Array<TreeObject | BlobObject> | Error> {
  const tree = await fetchObject(config, repoPath, oid);
  if (tree instanceof Error) {
    return tree;
  }
  if (tree.type !== 'tree') {
    return new Error('Invalid object type.');
  }

  const entries = await (async () => {
    const ps = tree.content.map(async (item) => {
      const entry = await fetchObject(config, repoPath, item.oid);
      if (entry instanceof Error) {
        throw Error;
      }
      if (entry.type === 'commit' || entry.type === 'tag') {
        throw new Error('Invalid object type.');
      }

      return entry;
    });

    return await Promise.all(ps);
  })().catch((err: Error) => err);

  return entries;
}

export async function fetchObject(
  config: CkusroConfig,
  repoPath: RepoPath,
  oid: string,
): Promise<GitObject | Error> {
  const path = gitDir(config.base, repoPath);
  const objectDescription = await (async () =>
    Git.readObject({
      core: config.coreId,
      gitdir: path,
      oid,
    }))().catch((err: Error) => err);
  if (objectDescription instanceof Error) {
    return objectDescription;
  }

  const { type, object } = objectDescription;
  switch (type) {
    case 'commit':
      return { oid, type: 'commit', content: object as Git.CommitDescription };
    case 'tree':
      return {
        oid,
        type: 'tree',
        content: (object as Git.TreeDescription).entries,
      };
    case 'blob':
      return { oid, type: 'blob', content: object as Buffer };
    case 'tag':
      return { oid, type: 'tag', content: object as Git.TagDescription };
    default:
      return new Error('Invalid object type.');
  }
}

export async function fetch(
  config: CkusroConfig,
  repoPath: RepoPath,
  ref?: string,
) {
  const result = await Git.fetch({
    core: config.coreId,
    token: config.authentication.github || undefined,
    dir: toPath(config.base, repoPath),
    ref: ref || 'master',
    singleBranch: true,
  }).catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  if (result.fetchHead == null) {
    return;
  }

  const checkoutResult = await checkout(config, repoPath, result.fetchHead);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return;
}

export async function pull(
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<string | Error> {
  const result = await fetch(config, repoPath);
  if (result instanceof Error) {
    return result;
  }

  return headOid(config, repoPath);
}

export async function checkout(
  config: CkusroConfig,
  repoPath: RepoPath,
  ref: string,
): Promise<void | Error> {
  const checkoutResult = await Git.checkout({
    core: config.coreId,
    dir: toPath(config.base, repoPath),
    ref,
  }).catch((err: Error) => err);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return;
}
