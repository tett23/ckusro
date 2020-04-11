import FS from 'fs';
import headTree from './headTree';
import { fetchByPath } from './fetchByPath';
import { GitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export default async function fetchByPathFromCurrentRoot(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  path: string,
): Promise<GitObject | null | Error> {
  const root = await headTree(fs, config);
  if (root instanceof Error) {
    return root;
  }

  return fetchByPath(fs, config, root, path);
}
