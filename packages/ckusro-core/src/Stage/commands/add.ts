import { CkusroConfig } from '../../models/CkusroConfig';
import { writeBlobByPath } from '../writeBlobByPath';
import { PathTreeOrBlobObject } from '../updateOrAppendObject';
import {
  WriteInfo,
  BlobWriteInfo,
  TreeWriteInfo,
} from '../../models/WriteInfo';
import { writeTree } from '../writeTree';
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
      return writeBlobByPath(config, root, writeInfo as BlobWriteInfo);
    default:
      return new Error('');
  }
}
