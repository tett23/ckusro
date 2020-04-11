import { CommitObject, TagObject, TreeObject, BlobObject } from './GitObject';
import { TreeEntry } from './TreeEntry';

export type CommitWriteInfo = {
  type: 'commit';
  path: string;
  content: CommitObject['content'];
};

export type TreeWriteInfo = {
  type: 'tree';
  path: string;
  content: TreeObject['content'];
};

export type BlobWriteInfo = {
  type: 'blob';
  path: string;
  content: BlobObject['content'];
};

export type TagWriteInfo = {
  type: 'blob';
  path: string;
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
  path: string,
  content: LookupWriteInfo<T>['content'],
): LookupWriteInfo<T> {
  switch (type) {
    case 'tree': {
      const ret: TreeWriteInfo = {
        type: 'tree',
        path,
        content: content as TreeEntry[],
      };

      return ret as LookupWriteInfo<T>;
    }
    case 'blob': {
      if (!(content instanceof Uint8Array)) {
        throw new Error('Blob format error');
      }

      const ret: BlobWriteInfo = {
        type: 'blob',
        path,
        content: Buffer.from(content),
      };

      return ret as LookupWriteInfo<T>;
    }
    default:
      throw new Error('');
  }
}
