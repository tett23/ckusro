import { TreeEntry } from '@ckusro/ckusro-core';
import React from 'react';
import TreeEntryBlob from './TreeEntryBlob';
import TreeEntryTree from './TreeEntryTree';

export type TreeEntryProps = {
  treeEntry: TreeEntry;
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
