import * as Git from 'isomorphic-git';
import { CkusroConfig } from '../models/CkusroConfig';
import { TreeObject } from '../models/GitObject';

export async function headTree(
  config: CkusroConfig,
): Promise<TreeObject | Error> {
  const oid = await headOid(config);
  if (oid instanceof Error) {
    return oid;
  }

  const headCommit = await Git.readObject({
    core: config.coreId,
    gitdir: config.stage,
    oid,
  }).catch((err: Error) => err);
  if (headCommit instanceof Error) {
    return headCommit;
  }

  const treeObject = await Git.readObject({
    core: config.coreId,
    gitdir: config.stage,
    oid: (headCommit.object as Git.CommitDescription).tree,
  }).catch((err: Error) => err);
  if (treeObject instanceof Error) {
    return treeObject;
  }

  return {
    type: 'tree',
    oid: treeObject.oid,
    content: (treeObject.object as Git.TreeDescription).entries,
  };
}

export async function headOid(config: CkusroConfig): Promise<string | Error> {
  const headOid = await (async () =>
    Git.resolveRef({
      core: config.coreId,
      gitdir: config.stage,
      ref: 'HEAD',
    }))().catch((err: Error) => err);
  if (headOid instanceof Error) {
    return headOid;
  }

  return headOid;
}
