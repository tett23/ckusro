import { TreeEntry as TreeEntryType, InternalPath } from '@ckusro/ckusro-core';
import React from 'react';
import BlobObject from './GitObject/BlobObject';
import TreeObject from './GitObject/TreeObject';

type OwnProps = {
  treeEntry: TreeEntryType;
  internalPath: InternalPath;
};

export type TreeEntryProps = OwnProps;

export default function TreeEntry({
  treeEntry: { type, oid },
  internalPath,
}: TreeEntryProps) {
  switch (type) {
    case 'tree':
      return <TreeObject oid={oid} internalPath={internalPath} />;
    case 'blob':
      return <BlobObject oid={oid} internalPath={internalPath} />;
    default:
      return null;
  }
}
