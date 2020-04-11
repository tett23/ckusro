import FS from 'fs';
import { TreeObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import headOid from './headOid';

export default async function headTree(
  fs: typeof FS,
  config: IsomorphicGitConfig,
): Promise<TreeObject | Error> {
  const oid = await headOid(fs, config);
  if (oid instanceof Error) {
    return oid;
  }

  const headCommit = await fetchByOid(fs, config, oid, 'commit');
  if (headCommit instanceof Error) {
    return headCommit;
  }
  if (headCommit == null) {
    return new Error('');
  }

  const treeObject = await fetchByOid(
    fs,
    config,
    headCommit.content.tree,
    'tree',
  );
  if (treeObject instanceof Error) {
    return treeObject;
  }
  if (treeObject == null) {
    return new Error('');
  }

  return {
    type: 'tree',
    oid: treeObject.oid,
    content: treeObject.content,
  };
}
