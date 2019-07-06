import { CkusroConfig } from '../models/CkusroConfig';
import { TreeObject, GitObject, isBlobObject } from '../models/GitObject';
import { fetchByOid } from './fetchByOid';
import normalizePath from '../utils/normalizePath';

export async function fetchByPath(
  config: CkusroConfig,
  tree: TreeObject,
  path: string,
): Promise<GitObject | null | Error> {
  const normalized = normalizePath(path);
  if (normalized === '/') {
    return tree;
  }

  const paths = normalized.split('/').slice(1);
  if (paths.length === 0) {
    return tree;
  }

  return fetchItem(config, tree, paths);
}

async function fetchItem(
  config: CkusroConfig,
  tree: TreeObject,
  paths: string[],
): Promise<GitObject | null | Error> {
  const [head, ...tail] = paths;
  if (head == null) {
    return new Error('Invalid paths.');
  }

  const entry = tree.content.find((item) => item.path === head);
  if (entry == null) {
    return null;
  }

  const newTreeOrBlob = await fetchByOid(config, entry.oid);
  if (newTreeOrBlob instanceof Error) {
    return newTreeOrBlob;
  }
  if (newTreeOrBlob == null) {
    return null;
  }

  if (isBlobObject(newTreeOrBlob) || tail.length === 0) {
    return newTreeOrBlob;
  }

  return fetchItem(config, newTreeOrBlob as TreeObject, tail);
}
