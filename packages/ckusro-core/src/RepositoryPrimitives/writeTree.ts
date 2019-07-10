import { TreeWriteInfo } from '../models/writeInfo';
import updateOrAppendObject from './updateOrAppendObject';
import { PathTreeObject } from '../models/PathTreeObject';
import { fetchOrCreateTreeByPath } from './fetchOrCreateTreeByPath';
import updateOrAppendTreeEntries from './updateOrAppendTreeEntries';
import {
  compareTreeEntries,
  UnpersistedTreeObject,
  TreeObject,
} from '../models/GitObject';
import { writeObject } from './writeObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import normalizePath from '../utils/normalizePath';

export async function writeTree(
  config: IsomorphicGitConfig,
  currentTree: TreeObject,
  writeInfo: TreeWriteInfo,
): Promise<PathTreeObject[] | Error> {
  const path = normalizePath(writeInfo.path);
  const tree = await fetchOrCreateTreeByPath(config, currentTree, path);
  if (tree instanceof Error) {
    return tree;
  }

  const [[leafPath, leaf]] = tree.slice(-1);
  const isSameEntries = compareTreeEntries(writeInfo.content, leaf.content);
  if (isSameEntries) {
    return tree;
  }

  const newEntries = writeInfo.content.reduce((acc, entry) => {
    if (acc instanceof Error) {
      return acc;
    }

    return updateOrAppendTreeEntries(acc, entry);
  }, leaf.content);
  if (newEntries instanceof Error) {
    return newEntries;
  }

  const unpersistedTree: UnpersistedTreeObject = {
    type: 'tree',
    content: newEntries,
  };
  const persistedTree = await writeObject(config, unpersistedTree);
  if (persistedTree instanceof Error) {
    return persistedTree;
  }

  const parents = tree.slice(0, -1);

  return updateOrAppendObject(config, parents, [leafPath, persistedTree]);
}
