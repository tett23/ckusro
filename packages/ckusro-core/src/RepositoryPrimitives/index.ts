import FS from 'fs';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import { writeBlob } from './writeBlob';
import {
  TreeObject,
  UnpersistedGitObject,
  CommitObject,
  GitObjectTypes,
} from '../models/GitObject';
import { BlobWriteInfo, TreeWriteInfo } from '../models/writeInfo';
import { writeTree } from './writeTree';
import { writeObject } from './writeObject';
import { fetchByPath } from './fetchByPath';
import headOid from './headOid';
import fetchByOid from './fetchByOid';
import { fetchTreeEntries } from './fetchTreeEntries';
import headCommitObject from './headCommitObject';
import headTree from './headTree';
import writeRef, { WriteRefOptions } from './writeRef';
import { removeFromTree } from './removeFromTree';
import { PathTreeObject } from '../models/PathTreeObject';
import removeFromTreeByPath from './removeFromTreeByPath';
import lsFilesByRef from './lsFilesByRef';
import lsFilesByTree from './lsFilesByTree';
import revParse from './revParse';
import fetchObjectByRef from './fetchObjectByRef';
import add from './commands/add';
import commit from './commands/commit';
import batchWriteObjects from './batchWriteObjects';

export type RepositoryPrimitives = ReturnType<typeof repositoryPrimitives>;

export default function repositoryPrimitives(
  fs: typeof FS,
  config: IsomorphicGitConfig,
) {
  return {
    add: (root: TreeObject, writeInfo: BlobWriteInfo) =>
      add(fs, config, root, writeInfo),
    commit: (root: TreeObject, message: string) =>
      commit(fs, config, root, message),

    headOid: () => headOid(fs, config),
    headCommitObject: () => headCommitObject(fs, config),
    headTreeObject: () => headTree(fs, config),
    fetchByOid: <T extends GitObjectTypes>(oid: string, objectType?: T) =>
      fetchByOid(fs, config, oid, objectType),
    fetchByPath: (root: TreeObject, path: string) =>
      fetchByPath(fs, config, root, path),
    fetchByRef: (ref: string) => fetchObjectByRef(fs, config, ref),
    fetchTreeEntries: (oid: string) => fetchTreeEntries(fs, config, oid),
    writeBlob: (currentTree: TreeObject, writeInfo: BlobWriteInfo) =>
      writeBlob(fs, config, currentTree, writeInfo),
    writeTree: (currentTree: TreeObject, writeInfo: TreeWriteInfo) =>
      writeTree(fs, config, currentTree, writeInfo),
    writeObject: (unpersistedObject: UnpersistedGitObject) =>
      writeObject(fs, config, unpersistedObject),
    writeRef: (
      ref: string,
      commitObject: CommitObject,
      options: Partial<WriteRefOptions>,
    ) => writeRef(fs, config, ref, commitObject, options),
    batchWriteObjects: (objects: UnpersistedGitObject[]) =>
      batchWriteObjects(fs, config, objects),
    removeFromTree: (parents: PathTreeObject[], name: string) =>
      removeFromTree(fs, config, parents, name),
    removeFromTreeByPath: (root: TreeObject, path: string) =>
      removeFromTreeByPath(fs, config, root, path),
    revParse: (ref: string) => revParse(fs, config, ref),
    lsFilesByRef: (ref: string) => lsFilesByRef(fs, config, ref),
    lsFilesByTree: (tree: TreeObject) => lsFilesByTree(fs, config, tree),
  };
}
