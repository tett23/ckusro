import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { gitDir, RepoPath } from './models/RepoPath';

export type Repository = ReturnType<typeof repository>;

export function repository(config: CkusroConfig, coreId: string) {
  return {
    fetchHeadOid: (repoPath: RepoPath) =>
      fetchHeadOid(coreId, config, repoPath),
  };
}

export async function fetchHeadOid(
  coreId: string,
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<string | Error> {
  const path = gitDir(config.base, repoPath);
  const headOid = await (async () => {
    return Git.resolveRef({
      core: coreId,
      gitdir: path,
      ref: 'HEAD',
    });
  })().catch((err) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}
