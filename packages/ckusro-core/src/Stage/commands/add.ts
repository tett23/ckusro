import { writeBlob } from '../../RepositoryPrimitives/writeBlob';
import { PathTreeOrBlobObject } from '../../RepositoryPrimitives/updateOrAppendObject';
import { BlobWriteInfo, TreeWriteInfo } from '../../models/WriteInfo';
import { writeTree } from '../../RepositoryPrimitives/writeTree';
import { TreeObject } from '../../models/GitObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { toWriteInfo, GlobalWriteInfo } from '../../models/GlobalWriteInfo';

export default async function add<T extends GlobalWriteInfo>(
  config: IsomorphicGitConfig,
  root: TreeObject,
  globalWriteInfo: T,
): Promise<PathTreeOrBlobObject[] | Error> {
  const writeInfo = toWriteInfo(globalWriteInfo);

  switch (writeInfo.type) {
    case 'tree':
      return writeTree(config, root, writeInfo as TreeWriteInfo);
    case 'blob':
      return writeBlob(config, root, writeInfo as BlobWriteInfo);
    default:
      return new Error('');
  }
}
