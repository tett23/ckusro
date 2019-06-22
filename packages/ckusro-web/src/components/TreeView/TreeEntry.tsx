import { TreeEntry as TreeEntryType } from '@ckusro/ckusro-core';
import React from 'react';
import BlobObject from './GitObject/BlobObject';
import TreeObject from './GitObject/TreeObject';

type OwnProps = {
  treeEntry: TreeEntryType;
};

export type TreeEntryProps = OwnProps;

export default function TreeEntry({
  treeEntry: { type, oid, path },
}: TreeEntryProps) {
  switch (type) {
    case 'tree':
      return <TreeObject oid={oid} path={path} />;
    case 'blob':
      return <BlobObject oid={oid} path={path} />;
    default:
      return null;
  }
}
