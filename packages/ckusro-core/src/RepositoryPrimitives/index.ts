import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import { writeBlob } from './writeBlob';
import { TreeObject, UnpersistedGitObject } from '../models/GitObject';
import { BlobWriteInfo, TreeWriteInfo } from '../models/writeInfo';
import { writeTree } from './writeTree';
import { writeObject } from './writeObject';
import { fetchByPath } from './fetchByPath';
import headOid from './headOid';
import fetchByOid from './fetchByOid';
import { fetchTreeEntries } from './fetchTreeEntries';
import headCommitObject from './headCommitObject';
import headTree from './headTree';

export default function repositoryPrimitives(config: IsomorphicGitConfig) {
  return {
    headOid: () => headOid(config),
    headCommitObject: () => headCommitObject(config),
    headTreeObject: () => headTree(config),
    fetchByOid: (oid: string) => fetchByOid(config, oid),
    fetchByPath: (root: TreeObject, path: string) =>
      fetchByPath(config, root, path),
    fetchTreeEntries: (oid: string) => fetchTreeEntries(config, oid),
    writeBlob: (currentTree: TreeObject, writeInfo: BlobWriteInfo) =>
      writeBlob(config, currentTree, writeInfo),
    writeTree: (currentTree: TreeObject, writeInfo: TreeWriteInfo) =>
      writeTree(config, currentTree, writeInfo),
    writeObject: (unpersistedObject: UnpersistedGitObject) =>
      writeObject(config, unpersistedObject),
  };
}
