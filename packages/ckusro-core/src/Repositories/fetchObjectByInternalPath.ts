import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { GitObject } from '../models/GitObject';
import { InternalPath } from '../models/InternalPath';
import fetchRepository from './fetchRepository';

export default async function fetchObjectByInternalPath(
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
