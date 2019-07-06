import { BlobObject, TreeObject } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';

export async function fetchTreeEntries(
  config: IsomorphicGitConfig,
  oid: string,
): Promise<Array<TreeObject | BlobObject> | Error> {
  const tree = await fetchByOid(config, oid);
  if (tree instanceof Error) {
    return tree;
  }
  if (tree == null) {
    return new Error(`Object not found. oid=${oid}`);
  }
  if (tree.type !== 'tree') {
    return new Error('Invalid object type.');
  }

  const entries = await (async () => {
    const ps = tree.content.map(async (item) => {
      const entry = await fetchByOid(config, item.oid);
      if (entry instanceof Error) {
        throw entry;
      }
      if (entry == null) {
        throw new Error(`Object not found. path=${item.path} oid=${oid}`);
      }

      if (entry.type === 'commit' || entry.type === 'tag') {
        throw new Error('Invalid object type.');
      }

      return entry;
    });

    return await Promise.all(ps);
  })().catch((err: Error) => err);

  return entries;
}
