import FS from 'fs';
import { writeBlob } from '../../RepositoryPrimitives/writeBlob';
import { PathTreeOrBlobObject } from '../../models/PathTreeObject';
import { BlobWriteInfo } from '../../models/WriteInfo';
import { TreeObject } from '../../models/GitObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';

export default async function add(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  root: TreeObject,
  writeInfo: BlobWriteInfo,
): Promise<PathTreeOrBlobObject[] | Error> {
  return writeBlob(fs, config, root, writeInfo as BlobWriteInfo);
}
