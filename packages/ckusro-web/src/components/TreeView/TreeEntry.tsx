import { TreeEntry as TreeEntryType } from '@ckusro/ckusro-core';
import React from 'react';
import BlobObject from './GitObject/BlobObject';
import TreeObject from './GitObject/TreeObject';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export default function TreeEntry({ treeEntry }: TreeEntryProps) {
  switch (treeEntry.type) {
    case 'tree':
      return <TreeObject oid={treeEntry.oid} path={treeEntry.path} />;
    case 'blob':
      return <BlobObject oid={treeEntry.oid} path={treeEntry.path} />;
    default:
      return null;
  }
}
