import {
  TreeEntry as TreeEntryType,
  TreeObject as TreeObjectType,
} from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../models/ObjectManager';
import { State } from '../../modules';
import FetchObjects from '../FetchObject';
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
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(oid),
  );
  if (gitObject == null) {
    return <FetchObjects oids={oid == null ? [] : [oid]} />;
  }

  return (
    <FetchObjects oids={gitObject.content.map(({ oid }) => oid)}>
      <TreeEntries treeEntries={gitObject.content} />
    </FetchObjects>
  );
}
