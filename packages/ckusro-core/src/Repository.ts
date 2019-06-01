import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import {
  BlobObject,
  CommitObject,
  GitObject,
  TreeObject,
} from './models/GitObject';
import { gitDir, RepoPath } from './models/RepoPath';

export type Repository = ReturnType<typeof repository>;

export function repository(
  config: CkusroConfig,
  coreId: string,
  repoPath: RepoPath,
) {
  return {
    headOid: () => headOid(config, coreId, repoPath),
    headCommitObject: () => headCommitObject(config, coreId, repoPath),
    headRootTree: () => headRootTree(config, coreId, repoPath),
    readTree: (oid: string) => readTree(config, coreId, repoPath, oid),
  };
}

export async function headOid(
  config: CkusroConfig,
  coreId: string,
  repoPath: RepoPath,
): Promise<string | Error> {
  const path = gitDir(config.base, repoPath);
  const headOid = await (async () =>
    Git.resolveRef({
      core: coreId,
      gitdir: path,
      ref: 'HEAD',
    }))().catch((err) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}

export async function headCommitObject(
  config: CkusroConfig,
  coreId: string,
  repoPath: RepoPath,
): Promise<CommitObject | Error> {
  const oid = await headOid(config, coreId, repoPath);
  if (oid instanceof Error) {
    return oid;
  }

  const commit = await fetchObject(config, coreId, repoPath, oid);
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
  coreId: string,
  repoPath: RepoPath,
): Promise<TreeObject | Error> {
  const commit = await headCommitObject(config, coreId, repoPath);
  if (commit instanceof Error) {
    return commit;
  }

  const tree = await fetchObject(config, coreId, repoPath, commit.content.tree);
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
  coreId: string,
  repoPath: RepoPath,
  oid: string,
): Promise<Array<TreeObject | BlobObject> | Error> {
  const tree = await fetchObject(config, coreId, repoPath, oid);
  if (tree instanceof Error) {
    return tree;
  }
  if (tree.type !== 'tree') {
    return new Error('Invalid object type.');
  }

  const entries = await (async () => {
    const ps = tree.content.map(async (item) => {
      console.log(item);
      const entry = await fetchObject(config, coreId, repoPath, item.oid);
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

async function fetchObject(
  config: CkusroConfig,
  coreId: string,
  repoPath: RepoPath,
  oid: string,
): Promise<GitObject | Error> {
  const path = gitDir(config.base, repoPath);
  const objectDescription = await (async () =>
    Git.readObject({
      core: coreId,
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
