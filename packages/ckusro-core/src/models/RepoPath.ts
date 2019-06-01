import { join } from 'path';

export type RepoPath = {
  domain: string;
  user: string;
  name: string;
};

export function toPath(base: string, { domain, user, name }: RepoPath) {
  return join('/', base, domain, user, name);
}

export function gitDir(base: string, repoPath: RepoPath): string {
  return join(toPath(base, repoPath), '.git');
}

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
