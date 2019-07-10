import { TreeObject, BlobObject, GitObjectTypes } from './GitObject';

export type PathTreeObject = readonly [string, TreeObject];
export type PathTreeOrBlobObject = readonly [string, TreeObject | BlobObject];
export type LookupPathTreeObjectOrMixed<
  T extends GitObjectTypes
> = T extends 'tree'
  ? PathTreeObject
  : T extends 'blob'
  ? PathTreeOrBlobObject
  : never;
