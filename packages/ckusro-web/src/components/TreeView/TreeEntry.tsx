import { TreeEntry as TreeEntryType } from '@ckusro/ckusro-core';
import React from 'react';
import styled from '../styled';
import BlobObject from './GitObject/BlobObject';
import TreeObject from './GitObject/TreeObject';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export default function TreeEntry({ treeEntry }: TreeEntryProps) {
  let component;
  switch (treeEntry.type) {
    case 'tree':
      component = <TreeObject oid={treeEntry.oid} path={treeEntry.path} />;
      break;
    case 'blob':
      component = <BlobObject oid={treeEntry.oid} path={treeEntry.path} />;
      break;
    default:
      return null;
  }

  return <Wrapper>{component}</Wrapper>;
}

const Wrapper = styled.View`
  overflow-x: hidden;
`;
