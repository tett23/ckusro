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
  config: IsomorphicGitConfig,
  root: TreeObject,
  path: string,
): Promise<PathTreeObject[] | Error> {
  const normalized = normalizePath(path);
  const parents = await fetchParents(config, root, normalized, {
    create: true,
  });
  if (parents instanceof Error) {
    return parents;
  }
  if (normalized === '/') {
    return parents;
  }

  const name = basename(normalized);

  return fetchOrCreate(config, parents, name);
}

async function fetchOrCreate(
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  name: string,
): Promise<PathTreeObject[] | Error> {
  const [[, parentObject]] = parents.slice(-1);
  if (parent == null || !isTreeObject(parentObject)) {
    return new Error('');
  }

  const leafEntry = parentObject.content.find((item) => item.path === name);
  if (leafEntry == null) {
    return appendAndUpdate(config, parents, name);
  }

  const leaf = await fetchByOid(config, leafEntry.oid, 'tree');
  if (leaf instanceof Error) {
    return leaf;
  }
  if (leaf != null) {
    return [...parents, [name, leaf]];
  }

  return appendAndUpdate(config, parents, name);
}

async function appendAndUpdate(
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  name: string,
): Promise<PathTreeObject[] | Error> {
  const writeResult = await writeObject(config, {
    type: 'tree',
    content: [],
  });
  if (writeResult instanceof Error) {
    return writeResult;
  }

  return updateOrAppendObject(config, parents, [name, writeResult]);
}
