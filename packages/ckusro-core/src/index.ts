import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import { clone, GitFsPlugin, plugins } from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { toPath, url2RepoPath } from './models/RepoPath';

export default function(config: CkusroConfig, fs: GitFsPlugin) {
  plugins.set('fs', fs);

  return {
    clone: (url: string) => cloneRepo(fs, config, url),
  };
}

export async function cloneRepo(
  fs: GitFsPlugin,
  config: CkusroConfig,
  url: string,
): Promise<true | Error> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const result = await (async () => {
    await clone({
      fs,
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
