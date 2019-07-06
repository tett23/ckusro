import { CommitDescription, TagDescription, TreeEntry } from 'isomorphic-git';
import typeToMode from '../utils/typeToMode';

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

export type GitObjectTypeCommit = 'commit';
export type GitObjectTyepTree = 'tree';
export type GitObjectTypeBlob = 'blob';
export type GitObjectTypeTag = 'tag';
export type GitObjectTypes =
  | GitObjectTypeCommit
  | GitObjectTyepTree
  | GitObjectTypeBlob
  | GitObjectTypeTag;

export type LookUpGitObject<N> = N extends CommitObject['type']
  ? CommitObject
  : N extends TreeObject['type']
  ? TreeObject
  : N extends BlobObject['type']
  ? BlobObject
  : N extends TagObject['type']
  ? TagObject
  : never;

export type LookUpGitObjectType<N> = N extends CommitObject['type']
  ? CommitObject
  : N extends TreeObject['type']
  ? TreeObject
  : N extends BlobObject['type']
  ? BlobObject
  : N extends TagObject['type']
  ? TagObject
  : never;

export type UnpersistedCommitObject = Omit<CommitObject, 'oid'>;
export type UnpersistedTreeObject = Omit<TreeObject, 'oid'>;
export type UnpersistedBlobObject = Omit<BlobObject, 'oid'>;
export type UnpersistedTagObject = Omit<TagObject, 'oid'>;

export type UnpersistedGitObject =
  | UnpersistedCommitObject
  | UnpersistedTreeObject
  | UnpersistedBlobObject
  | UnpersistedTagObject;

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

export function compareTreeEntry(left: TreeEntry, right: TreeEntry): boolean {
  if (left === right) {
    return true;
  }

  return (
    left.oid === right.oid &&
    left.path === right.path &&
    left.mode === right.mode &&
    left.type === right.type
  );
}

export function compareTreeEntries(
  left: TreeEntry[],
  right: TreeEntry[],
): boolean {
  if (left === right) {
    return true;
  }
  if (left.length !== right.length) {
    return false;
  }

  return left.every((leftItem) =>
    right.some((rightItem) => compareTreeEntry(leftItem, rightItem)),
  );
}

export function toTreeEntry(
  path: string,
  object: TreeObject | BlobObject,
): TreeEntry {
  return {
    type: object.type,
    oid: object.oid,
    mode: typeToMode(object.type),
    path,
  };
}
