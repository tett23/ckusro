import { TreeEntry as TreeEntryType } from '@ckusro/ckusro-core';
import React from 'react';
import BlobObject from './GitObject/BlobObject';
import CommitObject from './GitObject/CommitObject';
import TreeObject from './GitObject/TreeObject';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export default function TreeEntry({
  treeEntry: { oid, type, path },
}: TreeEntryProps) {
  switch (type) {
    case 'tree':
      return <TreeObject oid={oid} />;
    case 'blob':
      return <BlobObject oid={oid} path={path} />;
    case 'commit':
      return <CommitObject oid={oid} />;
    default:
      throw new Error(`Unexpected object type. type=${type}`);
  }
}
