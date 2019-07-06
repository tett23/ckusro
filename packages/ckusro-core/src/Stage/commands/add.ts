import { CkusroConfig } from '../../models/CkusroConfig';
import { writeBlob } from '../../RepositoryPrimitives/writeBlob';
import { PathTreeOrBlobObject } from '../../RepositoryPrimitives/updateOrAppendObject';
import {
  WriteInfo,
  BlobWriteInfo,
  TreeWriteInfo,
} from '../../models/WriteInfo';
import { writeTree } from '../../RepositoryPrimitives/writeTree';
import { TreeObject } from '../../models/GitObject';

export default async function add<T extends WriteInfo>(
  config: CkusroConfig,
  root: TreeObject,
  writeInfo: T,
): Promise<PathTreeOrBlobObject[] | Error> {
  switch (writeInfo.type) {
    case 'tree':
      return writeTree(config, root, writeInfo as TreeWriteInfo);
    case 'blob':
      return writeBlob(config, root, writeInfo as BlobWriteInfo);
    default:
      return new Error('');
  }
}
