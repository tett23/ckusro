import { TreeObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../models/ObjectManager';
import { State } from '../../modules';
import FetchObjects from '../FetchObject';
import { borderLeft, borderRight, View } from '../shared';
import styled from '../styled';
import TreeEntry from './TreeEntry';

type OwnProps = {
  oid: string;
  gitObject: TreeObject;
};

export type GitObjectListProps = OwnProps;

export function GitObjectList({ gitObject }: GitObjectListProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));

  return <Wrapper>{entries}</Wrapper>;
}

const Wrapper = styled(View)`
  overflow-y: scroll;
  width: 20vw;
  flex-basis: 20vw;
  ${borderRight};
  ${borderLeft};
`;

const Memoized = React.memo(
  GitObjectList,
  (prev, next) => prev.oid === next.oid,
);

export default function() {
  const { objectManager, currentOid } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.objectManager),
    currentOid: state.gitObjectList.currentOid,
  }));
  if (currentOid == null) {
    return <Wrapper />;
  }

  const gitObject = objectManager.fetch<TreeObject>(currentOid);
  if (gitObject == null) {
    return (
      <FetchObjects oids={[currentOid]}>
        <Wrapper />
      </FetchObjects>
    );
  }

  return (
    <FetchObjects oids={gitObject.content.map(({ oid }) => oid)}>
      <Memoized oid={currentOid} gitObject={gitObject} />
    </FetchObjects>
  );
}
