import {
  GitObject,
  TreeEntry as TreeEntryType,
  TreeObject as TreeObjectType,
} from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import FetchObject from '../FetchObject';
import styled from '../styled';
import TreeEntry from './TreeEntry';

export type TreeEntriesProps = { treeEntries: TreeEntryType[] };

export function TreeEntries({ treeEntries }: TreeEntriesProps) {
  const entries = treeEntries.map((item) => (
    <TreeEntry key={item.oid + item.path} treeEntry={item} />
  ));

  return <Wrapper>{entries}</Wrapper>;
}

const Wrapper = styled.View`
  margin-left: 1rem;
`;

export default function({ oid }: { oid: string }) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[oid],
  );
  if (gitObject == null) {
    return <FetchObject oid={oid} />;
  }

  return <TreeEntries treeEntries={(gitObject as TreeObjectType).content} />;
}
