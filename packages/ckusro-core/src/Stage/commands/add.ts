import { join } from 'path';
import pAdd from '../../RepositoryPrimitives/commands/add';
import { TreeObject } from '../../models/GitObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { toWriteInfo, GlobalWriteInfo } from '../../models/GlobalWriteInfo';
import { InternalPathGitObject } from '../../models/InternalPathTreeObject';

export default async function add<T extends GlobalWriteInfo>(
  config: IsomorphicGitConfig,
  root: TreeObject,
  globalWriteInfo: T,
): Promise<InternalPathGitObject[] | Error> {
  const writeInfo = toWriteInfo(globalWriteInfo);
  const addResult = await pAdd(config, root, writeInfo);
  if (addResult instanceof Error) {
    return addResult;
  }

  const repoPath = globalWriteInfo.internalPath.repoPath;
  return addResult.reduce(
    (acc: InternalPathGitObject[], [name, treeOrBlob]) => {
      const parentPath = (acc[acc.length - 1] || [{ path: '' }])[0].path;
      const internalPath = {
        repoPath,
        path: join('/', parentPath, name),
      };
      acc.push([internalPath, treeOrBlob] as const);

      return acc;
    },
    [],
  );
}
