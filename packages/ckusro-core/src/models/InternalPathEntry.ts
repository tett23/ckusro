import { InternalPath } from './InternalPath';
import { TreeEntry, BlobTreeEntry, TreeTreeEntry } from './TreeEntry';

export type InternalPathEntry = readonly [InternalPath, TreeEntry];
export type InternalPathBlobEntry = readonly [InternalPath, BlobTreeEntry];
export type InternalPathTreeEntry = readonly [InternalPath, TreeTreeEntry];
