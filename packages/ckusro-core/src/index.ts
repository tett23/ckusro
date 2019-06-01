import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import FS from 'fs';
import * as Git from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { gitDir, RepoPath, toPath, url2RepoPath } from './models/RepoPath';

const IsoGitCoreID = 'hoge';

export default function(config: CkusroConfig, fs: typeof FS) {
  const core = Git.cores.create(IsoGitCoreID);
  core.set('fs', fs);

  return {
    clone: (url: string) => cloneRepo(IsoGitCoreID, config, url),
    fetchHeadOid: (repoPath: RepoPath) =>
      fetchHeadOid(IsoGitCoreID, config, repoPath),
  };
}

export async function cloneRepo(
  coreId: string,
  config: CkusroConfig,
  url: string,
): Promise<true | Error> {
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

  return true;
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
