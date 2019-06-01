import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
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
) {
  const oid = await headOid(config, coreId, repoPath);
  if (oid instanceof Error) {
    return oid;
  }

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

  return objectDescription;
}
