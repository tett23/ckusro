import { writeObject } from './writeObject';
import updateOrAppendObject, { PathTreeObject } from './updateOrAppendObject';
import { TreeEntry } from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import removeTreeEntry from './removeTreeEntry';

export async function removeFromTree(
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  entry: TreeEntry,
): Promise<PathTreeObject[] | Error> {
  if (parents.length === 0) {
    return new Error('Invalid collection.');
  }

  const head = parents.slice(0, -1);
  const [[leafName, leafObject]] = parents.slice(-1);
  const removeResult = removeTreeEntry(leafObject.content, entry);
  if (removeResult instanceof Error) {
    return removeResult;
  }

  const newTree = await writeObject(config, {
    type: 'tree',
    content: removeResult,
  });
  if (newTree instanceof Error) {
    return newTree;
  }

  const newLeaf = [leafName, newTree] as const;
  if (head.length === 0) {
    return [newLeaf];
  }

  return updateOrAppendObject(config, head, newLeaf);
}
