import { TreeEntry as TreeEntryType, InternalPath } from '@ckusro/ckusro-core';
import React from 'react';
import BlobObject from './GitObject/BlobObject';
import TreeObject from './GitObject/TreeObject';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
  internalPath: InternalPath;
};

export default function TreeEntry({ treeEntry, internalPath }: TreeEntryProps) {
  return (
    <>
      <TreeEntryContent treeEntry={treeEntry} internalPath={internalPath} />
    </>
  );
}

export type TreeEntryContentProps = {
  treeEntry: TreeEntryType;
  internalPath: InternalPath;
};

export function TreeEntryContent({
  treeEntry: { oid, type },
  internalPath,
}: TreeEntryContentProps) {
  switch (type) {
    case 'tree':
      return <TreeObject oid={oid} internalPath={internalPath} />;
    case 'blob':
      return <BlobObject oid={oid} internalPath={internalPath} />;
    default:
      throw new Error(`Unexpected object type. type=${type}`);
  }
}
