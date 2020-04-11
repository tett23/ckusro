import FS from 'fs';
import { TreeObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchParents from './internal/fetchParents';
import { removeFromTree } from './removeFromTree';
import { PathTreeObject } from '../models/PathTreeObject';
import { basename } from 'path';
import normalizePath from '../utils/normalizePath';

export default async function removeFromTreeByPath(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  root: TreeObject,
  path: string,
): Promise<PathTreeObject[] | Error> {
  const parents = await fetchParents(fs, config, root, path);
  if (parents instanceof Error) {
    return parents;
  }

  return removeFromTree(fs, config, parents, normalizePath(basename(path)));
}
