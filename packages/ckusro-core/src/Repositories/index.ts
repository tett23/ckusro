import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { GitObject } from '../models/GitObject';
import { RepoPath } from '../models/RepoPath';
import { Repository, repository } from '../Repository';
import { InternalPath } from '../models/InternalPath';
import { toIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import isExistFileOrDirectory from '../utils/isExistFileOrDirectory';
import clone from './clone';
import separateErrors from '../utils/separateErrors';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(config: CkusroConfig, fs: typeof FS) {
  return {
    clone: (url: string) => clone(config, fs, url),
    allRepositories: () => allRepositories(config, fs),
    fetchRepository: (repoPath: RepoPath) =>
      fetchRepository(config, fs, repoPath),
    fetchObject: (oid: string) => fetchObject(config, fs, oid),
    fetchObjectByInternalPath: (internalPath: InternalPath) =>
      fetchObjectByInternalPath(config, fs, internalPath),
    headOids: () => headOids(config, fs),
  };
}

export async function allRepositories(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<Repository[] | Error> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    return fetchRepository(config, fs, repoPath);
  });
  const repos = await Promise.all(ps);

  const error = repos.find((item): item is Error => item instanceof Error);
  if (error != null) {
    return error;
  }

  return repos.filter((item): item is Repository => !(item instanceof Error));
}

export async function fetchRepository(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<Repository | Error> {
  const gitConfig = toIsomorphicGitConfig(config, repoPath);
  const isExist = await isExistFileOrDirectory(fs, gitConfig.gitdir);
  if (!isExist) {
    return new Error('Repository have not been cloned.');
  }

  return repository(gitConfig);
}

export async function fetchObject(
  config: CkusroConfig,
  fs: typeof FS,
  oid: string,
): Promise<GitObject | Error> {
  const repositories = await allRepositories(config, fs);
  if (repositories instanceof Error) {
    return repositories;
  }

  const ps = repositories.map((repo) => repo.fetchByOid(oid));
  const ret = (await Promise.all(ps)).find(
    (item): item is GitObject => !(item instanceof Error),
  );
  if (ret == null || ret instanceof Error) {
    return new Error(`Object not found. oid=${oid}`);
  }

  return ret;
}

export async function fetchObjectByInternalPath(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: InternalPath,
): Promise<GitObject | null | Error> {
  const repo = await fetchRepository(config, fs, internalPath.repoPath);
  if (repo instanceof Error) {
    return repo;
  }

  const root = await repo.headTreeObject();
  if (root instanceof Error) {
    return root;
  }

  return repo.fetchByPath(root, internalPath.path);
}

export async function headOids(
  config: CkusroConfig,
  fs: typeof FS,
): Promise<Array<readonly [string, RepoPath]> | Error> {
  const ps = config.repositories.map(async ({ repoPath }) => {
    const repo = await fetchRepository(config, fs, repoPath);
    if (repo instanceof Error) {
      return null;
    }

    const headOid = await repo.headOid();
    if (headOid instanceof Error) {
      return headOid;
    }

    return [headOid, repoPath] as const;
  });
  const [result, errors] = separateErrors(await Promise.all(ps));
  if (errors.length !== 0) {
    return errors[0];
  }

  const ret = result.filter(
    (item): item is readonly [string, RepoPath] => item != null,
  );

  return ret;
}
