import FS from 'fs';
import { CkusroConfig } from '../models/CkusroConfig';
import { RepoPath } from '../models/RepoPath';
import { Repository, repository } from '../Repository';
import { toIsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import isExistFileOrDirectory from '../utils/isExistFileOrDirectory';

export default async function fetchRepository(
  fs: typeof FS,
  config: CkusroConfig,
  repoPath: RepoPath,
): Promise<Repository | Error> {
  const gitConfig = toIsomorphicGitConfig(config, repoPath);
  const isExist = await isExistFileOrDirectory(fs, gitConfig.gitdir);
  if (!isExist) {
    return new Error('Repository have not been cloned.');
  }

  return repository(fs, gitConfig, repoPath);
}
