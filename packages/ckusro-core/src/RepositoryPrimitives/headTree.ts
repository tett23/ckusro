import * as Git from 'isomorphic-git';
import { TreeObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import { fetchByOid } from './fetchByOid';

export async function headTree(
  config: IsomorphicGitConfig,
): Promise<TreeObject | Error> {
  const oid = await headOid(config);
  if (oid instanceof Error) {
    return oid;
  }

  const headCommit = await fetchByOid(config, oid, 'commit');
  if (headCommit instanceof Error) {
    return headCommit;
  }
  if (headCommit == null) {
    return new Error('');
  }

  const treeObject = await fetchByOid(config, headCommit.content.tree, 'tree');
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

export async function headOid(
  config: IsomorphicGitConfig,
): Promise<string | Error> {
  const headOid = await (async () =>
    Git.resolveRef({
      ...config,
      ref: 'HEAD',
    }))().catch((err: Error) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}
