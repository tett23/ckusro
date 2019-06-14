import { GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import FetchObject from '../FetchObject';
import { borderLeft, borderRight } from '../shared';
import styled from '../styled';
import TreeEntry from './TreeEntry';

type StateProps = {
  oid: string | null;
  gitObject: GitObject | null;
};

export type GitObjectListProps = StateProps;

export function GitObjectList({ oid, gitObject }: GitObjectListProps) {
  if (oid == null || gitObject == null || gitObject.type !== 'tree') {
    return <Wrapper />;
  }

  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));

  return <Wrapper>{entries}</Wrapper>;
}

const Wrapper = styled.View`
  overflow-y: scroll;
  width: 20%;
  flex-basis: 20%;
  ${borderRight};
  ${borderLeft};
`;

export default function() {
  const { objectManager, currentOid } = useSelector((state: State) => ({
    objectManager: state.domain.objectManager,
    currentOid: state.gitObjectList.currentOid,
  }));
  const gitObject = currentOid == null ? null : objectManager[currentOid];
  if (gitObject == null) {
    return <FetchObject oid={currentOid} />;
  }

  return (
    <FetchObject oid={currentOid}>
      <GitObjectList oid={currentOid} gitObject={gitObject} />
    </FetchObject>
  );
}
