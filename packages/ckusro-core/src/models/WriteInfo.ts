import { InternalPath } from './InternalPath';
import {
  CommitObject,
  TagObject,
  TreeObject,
  BlobObject,
  TreeEntry,
} from './GitObject';
import { RepoPath } from './RepoPath';

export type CommitWriteInfo = {
  type: 'commit';
  internalPath: RepoPath;
  content: CommitObject['content'];
};

export type TreeWriteInfo = {
  type: 'tree';
  internalPath: InternalPath;
  content: TreeObject['content'];
};

export type BlobWriteInfo = {
  type: 'blob';
  internalPath: InternalPath;
  content: BlobObject['content'];
};

export type TagWriteInfo = {
  type: 'blob';
  internalPath: RepoPath;
  content: TagObject['content'];
};

export type WriteInfo = TreeWriteInfo | BlobWriteInfo;
export type LookupWriteInfo<T extends WriteInfo['type']> = T extends 'tree'
  ? TreeWriteInfo
  : T extends 'blob'
  ? BlobWriteInfo
  : T extends 'commit'
  ? CommitWriteInfo
  : T extends 'tag'
  ? TagWriteInfo
  : never;

export function createWriteInfo<T extends WriteInfo['type']>(
  type: T,
  internalPath: InternalPath,
  content: LookupWriteInfo<T>['content'],
): LookupWriteInfo<T> {
  switch (type) {
    case 'tree': {
      const ret: TreeWriteInfo = {
        type: 'tree',
        internalPath,
        content: content as TreeEntry[],
      };

      return ret as LookupWriteInfo<T>;
    }
    case 'blob': {
      const ret: BlobWriteInfo = {
        type: 'blob',
        internalPath,
        content: content as Buffer,
      };

      return ret as LookupWriteInfo<T>;
    }
    default:
      throw new Error('');
  }
}
