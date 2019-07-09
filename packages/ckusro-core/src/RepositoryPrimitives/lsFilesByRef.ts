import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import lsFilesByTree, { PathTreeEntry } from './lsFilesByTree';
import fetchObjectByRef from './fetchObjectByRef';

export default async function lsFilesByRef(
  config: IsomorphicGitConfig,
  ref: string,
): Promise<PathTreeEntry[] | Error> {
  const commit = await fetchObjectByRef(config, ref);
  if (commit instanceof Error) {
    return commit;
  }

  const tree = await fetchByOid(config, commit.content.tree, 'tree');
  if (tree instanceof Error) {
    return tree;
  }
  if (tree == null) {
    return new Error(
      `Commit not found. ref=${ref} commit=${commit.oid} tree=${commit.content.tree}`,
    );
  }

  return lsFilesByTree(config, tree);
}
