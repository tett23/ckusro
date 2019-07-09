import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import { writeBlob } from './writeBlob';
import {
  TreeObject,
  UnpersistedGitObject,
  CommitObject,
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
import { PathTreeObject } from './updateOrAppendObject';
import removeFromTreeByPath from './removeFromTreeByPath';
import lsFilesByRef from './lsFilesByRef';
import lsFilesByTree from './lsFilesByTree';
import revParse from './revParse';
import fetchObjectByRef from './fetchObjectByRef';

export default function repositoryPrimitives(config: IsomorphicGitConfig) {
  return {
    headOid: () => headOid(config),
    headCommitObject: () => headCommitObject(config),
    headTreeObject: () => headTree(config),
    fetchByOid: (oid: string) => fetchByOid(config, oid),
    fetchByPath: (root: TreeObject, path: string) =>
      fetchByPath(config, root, path),
    fetchByRef: (ref: string) => fetchObjectByRef(config, ref),
    fetchTreeEntries: (oid: string) => fetchTreeEntries(config, oid),
    writeBlob: (currentTree: TreeObject, writeInfo: BlobWriteInfo) =>
      writeBlob(config, currentTree, writeInfo),
    writeTree: (currentTree: TreeObject, writeInfo: TreeWriteInfo) =>
      writeTree(config, currentTree, writeInfo),
    writeObject: (unpersistedObject: UnpersistedGitObject) =>
      writeObject(config, unpersistedObject),
    writeRef: (
      ref: string,
      commitObject: CommitObject,
      options: Partial<WriteRefOptions>,
    ) => writeRef(config, ref, commitObject, options),
    removeFromTree: (parents: PathTreeObject[], name: string) =>
      removeFromTree(config, parents, name),
    removeFromTreeByPath: (root: TreeObject, path: string) =>
      removeFromTreeByPath(config, root, path),
    revParse: (ref: string) => revParse(config, ref),
    lsFilesByRef: (ref: string) => lsFilesByRef(config, ref),
    lsFilesByTree: (tree: TreeObject) => lsFilesByTree(config, tree),
  };
}
