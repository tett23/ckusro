import FS from 'fs';
import { basename, dirname } from 'path';
import { writeObject } from './writeObject';
import { fetchOrCreateTreeByPath } from './fetchOrCreateTreeByPath';
import updateOrAppendObject from './updateOrAppendObject';
import { PathTreeOrBlobObject } from '../models/PathTreeObject';
import { UnpersistedBlobObject, TreeObject } from '../models/GitObject';
import { BlobWriteInfo } from '../models/WriteInfo';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import normalizePath from '../utils/normalizePath';

export async function writeBlob(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  currentTree: TreeObject,
  writeInfo: BlobWriteInfo,
): Promise<PathTreeOrBlobObject[] | Error> {
  const normalized = normalizePath(writeInfo.path);
  const blobName = basename(normalized);
  const parentPath = dirname(normalized);

  const parents = await fetchOrCreateTreeByPath(
    fs,
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
  const persistedBlob = await writeObject(fs, config, unpersistedBlob);
  if (persistedBlob instanceof Error) {
    return persistedBlob;
  }

  return updateOrAppendObject(fs, config, parents, [blobName, persistedBlob]);
}
