import { TreeObject, BlobObject, GitObjectTypes } from './GitObject';
import { InternalPath } from './InternalPath';

export type InternalPathTreeObject = readonly [InternalPath, TreeObject];
export type InternalPathBlobObject = readonly [InternalPath, BlobObject];
export type InternalPathGitObject = readonly [
  InternalPath,
  TreeObject | BlobObject,
];
export type LookupInternalPathTreeObjectOrMixed<
  T extends GitObjectTypes
> = T extends 'tree'
  ? InternalPathTreeObject
  : T extends 'blob'
  ? InternalPathGitObject
  : never;
