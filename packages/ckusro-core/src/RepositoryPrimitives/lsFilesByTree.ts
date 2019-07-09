import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import {
  TreeEntry,
  isBlobObject,
  isCommitObject,
  isTagObject,
  TreeObject,
} from '../models/GitObject';
import { join } from 'path';
import separateErrors from '../utils/separateErrors';
import typeToMode from '../utils/typeToMode';

export type PathTreeEntry = readonly [string, TreeEntry];

export default async function lsFilesByTree(
  config: IsomorphicGitConfig,
  tree: TreeObject,
): Promise<PathTreeEntry[] | Error> {
  const rootEntry = {
    type: 'tree',
    path: '',
    oid: tree.oid,
    mode: typeToMode(tree.type),
  };

  return fetchRecursive(config, '/', rootEntry);
}

async function fetchRecursive(
  config: IsomorphicGitConfig,
  parentPath: string,
  treeEntry: TreeEntry,
): Promise<PathTreeEntry[] | Error> {
  const object = await fetchByOid(config, treeEntry.oid);
  if (object instanceof Error) {
    return object;
  }
  if (object == null) {
    return [];
  }

  const newParentPath = join(parentPath, treeEntry.path);
  if (isCommitObject(object) || isTagObject(object)) {
    return new Error(
      `Unexpected object. type=${object.type} oid=${object.oid}`,
    );
  }

  if (isBlobObject(object)) {
    return [[newParentPath, treeEntry]];
  }

  const ps = object.content.map((item) =>
    fetchRecursive(config, newParentPath, item),
  );
  const result = await Promise.all(ps);
  if (result instanceof Error) {
    return result;
  }

  const [ret, errors] = separateErrors(result);
  if (errors.length !== 0) {
    return errors[0];
  }

  return [[newParentPath, treeEntry], ...ret.flat()];
}
