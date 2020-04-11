import FS from 'fs';
import { TreeObject, isTreeObject } from '../models/GitObject';
import { writeObject } from './writeObject';
import updateOrAppendObject from './updateOrAppendObject';
import { PathTreeObject } from '../models/PathTreeObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchParents from './internal/fetchParents';
import fetchByOid from './fetchByOid';
import { basename } from 'path';
import normalizePath from '../utils/normalizePath';

export async function fetchOrCreateTreeByPath(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  root: TreeObject,
  path: string,
): Promise<PathTreeObject[] | Error> {
  const normalized = normalizePath(path);
  const parents = await fetchParents(fs, config, root, normalized, {
    create: true,
  });
  if (parents instanceof Error) {
    return parents;
  }
  if (normalized === '/') {
    return parents;
  }

  const name = basename(normalized);

  return fetchOrCreate(fs, config, parents, name);
}

async function fetchOrCreate(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  name: string,
): Promise<PathTreeObject[] | Error> {
  const [[, parentObject]] = parents.slice(-1);
  if (parentObject == null || !isTreeObject(parentObject)) {
    return new Error('');
  }

  const leafEntry = parentObject.content.find((item) => item.path === name);
  if (leafEntry == null) {
    return appendAndUpdate(fs, config, parents, name);
  }

  const leaf = await fetchByOid(fs, config, leafEntry.oid, 'tree');
  if (leaf instanceof Error) {
    return leaf;
  }
  if (leaf != null) {
    return [...parents, [name, leaf]];
  }

  return appendAndUpdate(fs, config, parents, name);
}

async function appendAndUpdate(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  name: string,
): Promise<PathTreeObject[] | Error> {
  const writeResult = await writeObject(fs, config, {
    type: 'tree',
    content: [],
  });
  if (writeResult instanceof Error) {
    return writeResult;
  }

  return updateOrAppendObject(fs, config, parents, [name, writeResult]);
}
