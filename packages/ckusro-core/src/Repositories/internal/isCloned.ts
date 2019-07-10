import FS from 'fs';
import { CkusroConfig } from '../../models/CkusroConfig';
import { RepoPath, gitDir } from '../../models/RepoPath';
import isExistFileOrDirectory from '../../utils/isExistFileOrDirectory';

export default async function isCloned(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: RepoPath,
): Promise<boolean> {
  const dirPath = gitDir(config.base, repoPath);

  return isExistFileOrDirectory(fs, dirPath);
}
