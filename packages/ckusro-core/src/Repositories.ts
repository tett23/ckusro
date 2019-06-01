import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { toPath, url2RepoPath } from './models/RepoPath';
import { Repository, repository } from './Repository';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(config: CkusroConfig, coreId: string) {
  return {
    clone: (url: string) => clone(coreId, config, url),
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
