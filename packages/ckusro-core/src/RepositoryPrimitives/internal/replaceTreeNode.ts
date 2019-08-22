import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import { LookupPathTreeObjectOrMixed } from '../../models/PathTreeObject';
import fetchParents from './fetchParents';
import headTree from '../headTree';
import updateOrAppendObject from '../updateOrAppendObject';
import { basename } from 'path';
import { TreeObject, BlobObject } from '../../models/GitObject';
import normalizePath from '../../utils/normalizePath';

export default async function replaceTreeNode<
  T extends TreeObject | BlobObject
>(
  config: IsomorphicGitConfig,
  path: string,
  gitObject: T,
): Promise<Array<LookupPathTreeObjectOrMixed<T['type']>> | Error> {
  const root = await headTree(config);
  if (root instanceof Error) {
    return root;
  }

  if (normalizePath(path) === '/') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ([[path, gitObject]] as any) as Array<
      LookupPathTreeObjectOrMixed<T['type']>
    >;
  }

  const parents = await fetchParents(config, root, path, { create: false });
  if (parents instanceof Error) {
    return parents;
  }

  return updateOrAppendObject(config, parents, [basename(path), gitObject]);
}
