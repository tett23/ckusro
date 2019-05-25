import 'core-js/modules/es.array.flat';
import 'core-js/modules/es.array.flat-map';
import { clone, GitFsPlugin, plugins } from 'isomorphic-git';

export default function(fs: GitFsPlugin) {
  plugins.set('fs', fs);

  return {
    clone,
  };
}

export async function cloneRepository(url: string) {
  await clone({
    dir: url,
    url,
  });
}

export type RepoPath = {
  domain: string;
  user: string;
  name: string;
};

export function url2RepoPath(url: string): RepoPath | Error {
  const items = url.split(/[@/:]/);

  const name = (items.pop() || '').split('.')[0];
  const user = items.pop() || '';
  const domain = items.pop() || '';
  const ret = {
    domain,
    user,
    name,
  };

  const invalid = Object.values(ret).some((item) => item.length === 0);
  if (invalid) {
    return new Error(`Malformed URL. url=${url}`);
  }

  return ret;
}
