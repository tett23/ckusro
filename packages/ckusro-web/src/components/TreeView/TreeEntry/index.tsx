import { TreeEntry as TreeEntryType } from '@ckusro/ckusro-core';
import React from 'react';
import TreeEntryBlob from './TreeEntryBlob';
import TreeEntryTree from './TreeEntryTree';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export default function TreeEntry({ treeEntry }: TreeEntryProps) {
  switch (treeEntry.type) {
    case 'tree':
      return <TreeEntryTree treeEntry={treeEntry} />;
    case 'blob':
      return <TreeEntryBlob treeEntry={treeEntry} />;
    default:
      return null;
  }
}
