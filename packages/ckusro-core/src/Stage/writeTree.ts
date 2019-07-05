import * as Git from 'isomorphic-git';
import { CkusroConfig } from '../models/CkusroConfig';
import { TreeObject, TreeEntry } from '../models/GitObject';

export async function writeTree(
  config: CkusroConfig,
  parents: Array<[string, TreeObject]>,
  name: string,
  content: TreeEntry[],
): Promise<string | Error> {
  const treeOid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: 'tree',
    object: { entries: content },
  }).catch((err: Error) => err);
  if (treeOid instanceof Error) {
    return treeOid;
  }

  const [[, parentTree]] = parents.slice(-1);
  const parentEntries = [
    ...parentTree.content,
    {
      type: 'tree',
      mode: '040000',
      path: name,
      oid: treeOid,
    },
  ];
  const parentOid = await Git.writeObject({
    core: config.coreId,
    gitdir: config.stage,
    type: 'tree',
    object: {
      entries: parentEntries,
    },
  }).catch((err: Error) => err);
  if (parentOid instanceof Error) {
    return parentOid;
  }

  const head = parents.slice(0, -1);
  const rootTree = await head
    .reverse()
    .reduce(async (acc: Promise<string | Error>, [changedName, tree]): Promise<
      string | Error
    > => {
      const prev = await acc;
      if (prev instanceof Error) {
        return prev;
      }
      const [changedOid] = prev;

      const idx = tree.content.findIndex((item) => item.path === changedName);
      const newEntries = [
        ...tree.content.slice(0, idx - 1),
        {
          type: 'tree',
          mode: '100644',
          path: changedName,
          oid: changedOid,
        },
        ...tree.content.slice(idx),
      ];

      const parentOid = await Git.writeObject({
        core: config.coreId,
        gitdir: config.stage,
        type: 'tree',
        object: {
          entries: newEntries,
        },
      }).catch((err: Error) => err);
      if (parentOid instanceof Error) {
        return parentOid;
      }

      return parentOid;
    }, Promise.resolve(parentOid));
  if (rootTree instanceof Error) {
    return rootTree;
  }

  return rootTree;
}
