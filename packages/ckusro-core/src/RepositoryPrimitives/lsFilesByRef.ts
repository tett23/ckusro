import FS from 'fs';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import lsFilesByTree from './lsFilesByTree';
import { PathTreeEntry } from '../models/PathTreeEntry';
import fetchObjectByRef from './fetchObjectByRef';

export default async function lsFilesByRef(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  ref: string,
): Promise<PathTreeEntry[] | Error> {
  const commit = await fetchObjectByRef(fs, config, ref);
  if (commit instanceof Error) {
    return commit;
  }

  const tree = await fetchByOid(fs, config, commit.content.tree, 'tree');
  if (tree instanceof Error) {
    return tree;
  }
  if (tree == null) {
    return new Error(
      `Commit not found. ref=${ref} commit=${commit.oid} tree=${commit.content.tree}`,
    );
  }

  return lsFilesByTree(fs, config, tree);
}
