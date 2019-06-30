import { CommitDescription, TagDescription, TreeEntry } from 'isomorphic-git';

export type CommitObject = {
  oid: string;
  type: 'commit';
  content: CommitDescription;
};

export type TreeObject = {
  oid: string;
  type: 'tree';
  content: TreeEntry[];
};

export type TreeEntry = TreeEntry;

export type BlobObject = {
  oid: string;
  type: 'blob';
  content: Buffer;
};

export type TagObject = {
  oid: string;
  type: 'tag';
  content: TagDescription;
};

export type GitObject = CommitObject | TreeObject | BlobObject | TagObject;

export type GitObjectTypes = 'commit' | 'tree' | 'blob' | 'tag';

export type LookUpGitObjectType<N> = N extends CommitObject['type']
  ? CommitObject
  : N extends TreeObject['type']
  ? TreeObject
  : N extends BlobObject['type']
  ? BlobObject
  : N extends TagObject['type']
  ? TagObject
  : never;

export function isCommitObject(obj: GitObject): obj is CommitObject {
  return obj.type === 'commit';
}

export function isTreeObject(obj: GitObject): obj is TreeObject {
  return obj.type === 'tree';
}

export function isBlobObject(obj: GitObject): obj is BlobObject {
  return obj.type === 'blob';
}

export function isTagObject(obj: GitObject): obj is TagObject {
  return obj.type === 'tag';
}
