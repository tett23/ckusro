import { CkusroConfig } from '../models/CkusroConfig';
import { TreeObject, GitObject, isBlobObject } from '../models/GitObject';
import { headTree } from './head';
import { fetchByOid } from './fetchByOid';
import normalizePath from '../utils/normalizePath';

export async function fetchByPath(config: CkusroConfig, path: string) {
  const root = await headTree(config);
  if (root instanceof Error) {
    return root;
  }
  const normalized = normalizePath(path);
  if (normalized === '/') {
    return root;
  }

  const paths = normalized.split('/').slice(1);
  if (paths.length === 0) {
    return root;
  }

  return fetchItem(config, root as TreeObject, paths);
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
