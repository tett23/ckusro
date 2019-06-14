import { GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import FetchObject from '../FetchObject';
import { borderLeft, borderRight } from '../shared';
import styled from '../styled';
import TreeEntry from './TreeEntry';

type OwnProps = {
  oid: string;
  gitObject: GitObject;
};

export type GitObjectListProps = OwnProps;

export function GitObjectList({ gitObject }: GitObjectListProps) {
  if (gitObject.type !== 'tree') {
    return <Wrapper />;
  }

  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));

  return <Wrapper>{entries}</Wrapper>;
}

const Wrapper = styled.View`
  overflow-y: scroll;
  width: 20vw;
  flex-basis: 20vw;
  ${borderRight};
  ${borderLeft};
`;

export default function() {
  const { objectManager, currentOid } = useSelector((state: State) => ({
    objectManager: state.domain.objectManager,
    currentOid: state.gitObjectList.currentOid,
  }));
  const gitObject = currentOid == null ? null : objectManager[currentOid];
  if (currentOid == null || gitObject == null) {
    return (
      <FetchObject oid={currentOid}>
        <Wrapper />
      </FetchObject>
    );
  }

  return (
    <FetchObject oid={currentOid}>
      <GitObjectList oid={currentOid} gitObject={gitObject} />
    </FetchObject>
  );
}
