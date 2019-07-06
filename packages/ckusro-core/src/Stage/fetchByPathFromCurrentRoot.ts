import { headTree } from './head';
import { CkusroConfig } from '../models/CkusroConfig';
import { fetchByPath } from './fetchByPath';
import { GitObject } from '../models/GitObject';

export default async function fetchByPathFromCurrentRoot(
  config: CkusroConfig,
  path: string,
): Promise<GitObject | null | Error> {
  const root = await headTree(config);
  if (root instanceof Error) {
    return root;
  }

  return fetchByPath(config, root, path);
}
