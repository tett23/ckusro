import { CkusroConfig } from '../models/CkusroConfig';
import {
  TreeObject,
  isTreeObject,
  BlobObject,
  isBlobObject,
} from '../models/GitObject';
import { fetchByOid } from './fetchByOid';
import normalizePath from '../utils/normalizePath';

export async function fetchByPath(
  config: CkusroConfig,
  tree: TreeObject,
  path: string,
): Promise<TreeObject | BlobObject | null | Error> {
  const normalized = normalizePath(path);
  if (normalized === '/') {
    return tree;
  }

  const paths = normalized.split('/').slice(1);
  if (paths.length === 0) {
    return tree;
  }

  const [leafName] = paths.slice(-1);
  const parentPaths = paths.slice(0, -1);

  const parent = await fetchItem(config, tree, parentPaths);
  if (parent == null || parent instanceof Error) {
    return parent;
  }

  const leafEntry = parent.content.find((item) => item.path === leafName);
  if (leafEntry == null) {
    return null;
  }

  const object = await fetchByOid(config, leafEntry.oid);
  if (object == null || object instanceof Error) {
    return object;
  }
  if (!isTreeObject(object) || !isBlobObject(object)) {
    return new Error('Invalid object type.');
  }

  return object;
}

async function fetchItem(
  config: CkusroConfig,
  tree: TreeObject,
  paths: string[],
): Promise<TreeObject | null | Error> {
  const [head, ...tail] = paths;
  if (head == null) {
    return new Error('Invalid paths.');
  }

  const entry = tree.content.find((item) => item.path === head);
  if (entry == null) {
    return null;
  }

  const newTreeOrBlob = await fetchByOid(config, entry.oid);
  if (newTreeOrBlob == null || newTreeOrBlob instanceof Error) {
    return newTreeOrBlob;
  }
  if (!isTreeObject(newTreeOrBlob)) {
    return new Error('Invalid object type.');
  }
  if (tail.length === 0) {
    return newTreeOrBlob;
  }

  return fetchItem(config, newTreeOrBlob as TreeObject, tail);
}
