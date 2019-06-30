import {
  RepoPath,
  InternalPath,
  compareRepoPath,
  compareInternalPath,
} from '@ckusro/ckusro-core';

export type BufferTypes = 'commit' | 'tree' | 'blob' | 'tag';

export type BufferInfo =
  | CommitBufferInfo
  | TreeBufferInfo
  | BlobBufferInfo
  | TagBufferInfo;

export type CommitBufferInfo = {
  type: 'commit';
  oid: string;
  repoPath: RepoPath;
};

export type TreeBufferInfo = {
  type: 'tree';
  oid: string;
  internalPath: InternalPath;
};

export type BlobBufferInfo = {
  type: 'blob';
  oid: string;
  internalPath: InternalPath;
};

export type TagBufferInfo = {
  type: 'tag';
  oid: string;
  repoPath: RepoPath;
};

export type LookUpBufferInfoType<T> = T extends CommitBufferInfo['type']
  ? CommitBufferInfo
  : T extends TreeBufferInfo['type']
  ? TreeBufferInfo
  : T extends BlobBufferInfo['type']
  ? BlobBufferInfo
  : T extends TagBufferInfo['type']
  ? TagBufferInfo
  : never;

export type LookUpBufferInfoArg<T> = T extends CommitBufferInfo['type']
  ? RepoPath
  : T extends TreeBufferInfo['type']
  ? InternalPath
  : T extends BlobBufferInfo['type']
  ? InternalPath
  : T extends TagBufferInfo['type']
  ? RepoPath
  : never;

/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
export function createBufferInfo<T extends BufferTypes>(
  type: T,
  oid: string,
  value: LookUpBufferInfoArg<T>,
): LookUpBufferInfoType<T> {
  switch (type) {
    case 'commit':
      return {
        type: 'commit',
        oid,
        repoPath: value as RepoPath,
      } as LookUpBufferInfoType<T>;
    case 'tree':
      return {
        type: 'tree',
        oid,
        internalPath: value as InternalPath,
      } as LookUpBufferInfoType<T>;
    case 'blob':
      return {
        type: 'blob',
        oid,
        internalPath: value as InternalPath,
      } as LookUpBufferInfoType<T>;
    case 'tag':
      return {
        type: 'tag',
        oid,
        repoPath: value as RepoPath,
      } as LookUpBufferInfoType<T>;
    default:
      throw new Error('');
  }
}
/* eslint-enable @typescript-eslint/no-object-literal-type-assertion */

export function compareBufferInfo(
  left: BufferInfo,
  right: BufferInfo,
): boolean {
  if (left.type !== right.type) {
    return false;
  }
  if (left.oid !== right.oid) {
    return false;
  }

  switch (left.type) {
    case 'commit':
      return compareRepoPath(
        left.repoPath,
        (right as CommitBufferInfo).repoPath,
      );
    case 'blob':
      return compareInternalPath(
        left.internalPath,
        (right as BlobBufferInfo).internalPath,
      );
    case 'tree':
      return compareInternalPath(
        left.internalPath,
        (right as TreeBufferInfo).internalPath,
      );
    case 'tag':
      return compareRepoPath(left.repoPath, (right as TagBufferInfo).repoPath);
    default:
      return false;
  }
}
