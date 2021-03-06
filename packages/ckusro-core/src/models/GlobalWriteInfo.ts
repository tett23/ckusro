import { InternalPath, createInternalPath } from './InternalPath';
import { CommitObject, TagObject, TreeObject, BlobObject } from './GitObject';
import { TreeEntry } from './TreeEntry';
import { RepoPath } from './RepoPath';
import { LookupWriteInfo } from './writeInfo';

export type GlobalCommitWriteInfo = {
  type: 'commit';
  internalPath: RepoPath;
  content: CommitObject['content'];
};

export type GlobalTreeWriteInfo = {
  type: 'tree';
  internalPath: InternalPath;
  content: TreeObject['content'];
};

export type GlobalBlobWriteInfo = {
  type: 'blob';
  internalPath: InternalPath;
  content: BlobObject['content'];
};

export type GlobalTagWriteInfo = {
  type: 'blob';
  internalPath: RepoPath;
  content: TagObject['content'];
};

export type GlobalWriteInfo = GlobalTreeWriteInfo | GlobalBlobWriteInfo;
export type LookupGlobalWriteInfo<
  T extends GlobalWriteInfo['type']
> = T extends 'tree'
  ? GlobalTreeWriteInfo
  : T extends 'blob'
  ? GlobalBlobWriteInfo
  : T extends 'commit'
  ? GlobalCommitWriteInfo
  : T extends 'tag'
  ? GlobalTagWriteInfo
  : never;

export function createGlobalWriteInfo<T extends GlobalWriteInfo['type']>(
  type: T,
  internalPath: InternalPath,
  content: LookupGlobalWriteInfo<T>['content'],
): LookupGlobalWriteInfo<T> {
  switch (type) {
    case 'tree': {
      const ret: GlobalTreeWriteInfo = {
        type: 'tree',
        internalPath,
        content: content as TreeEntry[],
      };

      return ret as LookupGlobalWriteInfo<T>;
    }
    case 'blob': {
      if (!(content instanceof Uint8Array)) {
        throw new Error('Blob format error');
      }

      const ret: GlobalBlobWriteInfo = {
        type: 'blob',
        internalPath,
        content: Buffer.from(content),
      };

      return ret as LookupGlobalWriteInfo<T>;
    }
    default:
      throw new Error('');
  }
}

export function toWriteInfo<T extends GlobalWriteInfo>(
  globalWriteInfo: T,
): LookupWriteInfo<T['type']> {
  return {
    ...globalWriteInfo,
    path: createInternalPath(globalWriteInfo.internalPath).flat(),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
