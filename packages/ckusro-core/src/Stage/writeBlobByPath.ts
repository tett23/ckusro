import { basename, dirname } from 'path';
import { CkusroConfig } from '../models/CkusroConfig';
import { writeObject } from './writeObject';
import normalizePath from '../utils/normalizePath';
import { fetchOrCreateTreeByPath } from './fetchOrCreateTreeByPath';
import updateOrAppendTreeObject, {
  PathTreeOrBlobObject,
} from './updateOrAppendTreeObject';
import { UnpersistedBlobObject } from '../models/GitObject';

export async function writeBlobByPath(
  config: CkusroConfig,
  path: string,
  buffer: Buffer,
): Promise<PathTreeOrBlobObject[] | Error> {
  const normalized = normalizePath(path);
  const blobName = basename(normalized);
  const parentPath = dirname(normalized);

  const parents = await fetchOrCreateTreeByPath(config, parentPath);
  if (parents instanceof Error) {
    return parents;
  }

  const unpersistedBlob: UnpersistedBlobObject = {
    type: 'blob',
    content: buffer,
  };
  const persistedBlob = await writeObject(config, unpersistedBlob);
  if (persistedBlob instanceof Error) {
    return persistedBlob;
  }

  return updateOrAppendTreeObject(config, parents, [blobName, persistedBlob]);
}
