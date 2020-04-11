import FS from 'fs';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import fetchByOid from './fetchByOid';
import {
  isBlobObject,
  isCommitObject,
  isTagObject,
  TreeObject,
} from '../models/GitObject';
import { TreeEntry } from '../models/TreeEntry';
import { join } from 'path';
import separateErrors from '../utils/separateErrors';
import typeToMode from '../utils/typeToMode';
import { PathTreeEntry } from '../models/PathTreeEntry';

export default async function lsFilesByTree(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  tree: TreeObject,
): Promise<PathTreeEntry[] | Error> {
  const rootEntry = {
    type: 'tree' as const,
    path: '',
    oid: tree.oid,
    mode: typeToMode(tree.type),
  };

  return fetchRecursive(fs, config, '/', rootEntry);
}

async function fetchRecursive(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  parentPath: string,
  treeEntry: TreeEntry,
): Promise<PathTreeEntry[] | Error> {
  const object = await fetchByOid(fs, config, treeEntry.oid);
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
    fetchRecursive(fs, config, newParentPath, item),
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
