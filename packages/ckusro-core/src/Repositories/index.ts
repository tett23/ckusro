import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { RepoPath } from '../models/RepoPath';
import { InternalPath } from '../models/InternalPath';
import clone from './clone';
import fetchObjectByInternalPath from './fetchObjectByInternalPath';
import headOids from './headOids';
import fetchByOid from './fetchByOid';
import fetchRepository from './fetchRepository';
import clonedRepositories from './clonedRepositories';
import removeAllRepositories from './removeAllRepositories';

export type Repositories = ReturnType<typeof repositories>;

export function repositories(config: CkusroConfig, fs: typeof FS) {
  return {
    clone: (url: string) => clone(fs, config, url),
    removeAllRepositories: () => removeAllRepositories(config, fs),
    allRepositories: () => clonedRepositories(fs, config),
    fetchRepository: (repoPath: RepoPath) =>
      fetchRepository(fs, config, repoPath),
    fetchObject: (oid: string) => fetchByOid(fs, config, oid),
    fetchObjectByInternalPath: (internalPath: InternalPath) =>
      fetchObjectByInternalPath(config, fs, internalPath),
    headOids: () => headOids(config, fs),
  };
}
