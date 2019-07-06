import { basename, dirname } from 'path';
import { CkusroConfig } from '../models/CkusroConfig';
import { writeObject } from './writeObject';
import { fetchOrCreateTreeByPath } from './fetchOrCreateTreeByPath';
import updateOrAppendObject, {
  PathTreeOrBlobObject,
} from './updateOrAppendObject';
import { UnpersistedBlobObject, TreeObject } from '../models/GitObject';
import { BlobWriteInfo } from '../models/WriteInfo';
import { createInternalPath } from '../models/InternalPath';

export async function writeBlobByPath(
  config: CkusroConfig,
  currentTree: TreeObject,
  writeInfo: BlobWriteInfo,
): Promise<PathTreeOrBlobObject[] | Error> {
  const path = createInternalPath(writeInfo.internalPath).flat();
  const normalized = path;
  const blobName = basename(normalized);
  const parentPath = dirname(normalized);

  const parents = await fetchOrCreateTreeByPath(
    config,
    currentTree,
    parentPath,
  );
  if (parents instanceof Error) {
    return parents;
  }

  const unpersistedBlob: UnpersistedBlobObject = {
    type: 'blob',
    content: writeInfo.content,
  };
  const persistedBlob = await writeObject(config, unpersistedBlob);
  if (persistedBlob instanceof Error) {
    return persistedBlob;
  }

  return updateOrAppendObject(config, parents, [blobName, persistedBlob]);
}
