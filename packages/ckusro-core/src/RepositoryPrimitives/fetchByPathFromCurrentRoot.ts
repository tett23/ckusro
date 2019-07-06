import { headTree } from './headTree';
import { fetchByPath } from './fetchByPath';
import { GitObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export default async function fetchByPathFromCurrentRoot(
  config: IsomorphicGitConfig,
  path: string,
): Promise<GitObject | null | Error> {
  const root = await headTree(config);
  if (root instanceof Error) {
    return root;
  }

  return fetchByPath(config, root, path);
}
