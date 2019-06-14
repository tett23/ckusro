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
