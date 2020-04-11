import FS from 'fs';
import { writeObject } from './writeObject';
import updateOrAppendObject from './updateOrAppendObject';
import { PathTreeObject } from '../models/PathTreeObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import removeTreeEntry from './removeTreeEntry';

export async function removeFromTree(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  parents: PathTreeObject[],
  name: string,
): Promise<PathTreeObject[] | Error> {
  if (parents.length === 0) {
    return new Error('Invalid collection.');
  }

  const head = parents.slice(0, -1);
  const [[leafName, leafObject]] = parents.slice(-1);
  const removeResult = removeTreeEntry(leafObject.content, name);
  if (removeResult instanceof Error) {
    return removeResult;
  }

  const newTree = await writeObject(fs, config, {
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

  return updateOrAppendObject(fs, config, head, newLeaf);
}
