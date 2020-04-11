import FS from 'fs';
import { PathTreeObject } from '../../models/PathTreeObject';
import { TreeObject } from '../../models/GitObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { toWriteInfo, GlobalWriteInfo } from '../../models/GlobalWriteInfo';
import removeFromTreeByPath from '../../RepositoryPrimitives/removeFromTreeByPath';

export default async function remove<T extends GlobalWriteInfo>(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  root: TreeObject,
  globalWriteInfo: T,
): Promise<PathTreeObject[] | Error> {
  const writeInfo = toWriteInfo(globalWriteInfo);

  return removeFromTreeByPath(fs, config, root, writeInfo.path);
}
