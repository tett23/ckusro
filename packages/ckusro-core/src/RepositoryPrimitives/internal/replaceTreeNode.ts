import FS from 'fs';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { LookupPathTreeObjectOrMixed } from '../../models/PathTreeObject';
import fetchParents from './fetchParents';
import headTree from '../headTree';
import updateOrAppendObject from '../updateOrAppendObject';
import { basename } from 'path';
import { TreeObject, BlobObject } from '../../models/GitObject';
import normalizePath from '../../utils/normalizePath';
import wrapError from '../../utils/wrapError';

export default async function replaceTreeNode<
  T extends TreeObject | BlobObject
>(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  path: string,
  gitObject: T,
  options: { root?: TreeObject } = {},
): Promise<Array<LookupPathTreeObjectOrMixed<T['type']>> | Error> {
  const root = await (options.root == null
    ? headTree(fs, config)
    : options.root);
  if (root instanceof Error) {
    return wrapError(root);
  }

  const normalized = normalizePath(path);
  if (normalized === '/') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ([[path, gitObject]] as any) as Array<
      LookupPathTreeObjectOrMixed<T['type']>
    >;
  }

  const parents = await fetchParents(fs, config, root, path, { create: false });
  if (parents instanceof Error) {
    return wrapError(parents);
  }

  return updateOrAppendObject(fs, config, parents, [
    basename(normalized),
    gitObject,
  ]);
}
