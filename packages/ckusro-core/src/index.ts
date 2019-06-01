import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import { clone, GitFsPlugin, plugins } from 'isomorphic-git';
import { CkusroConfig } from './models/CkusroConfig';
import { toPath, url2RepoPath } from './models/RepoPath';

export default function(config: CkusroConfig, fs: GitFsPlugin) {
  plugins.set('fs', fs);

  return {
    clone,
  };
}

export async function cloneRepository(
  config: CkusroConfig,
  url: string,
): Promise<true | Error> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  await clone({
    dir: toPath(config.base, repoPath),
    url,
  });

  return true;
}
