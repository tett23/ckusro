import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text } from 'react-native';
import { useStore } from 'react-redux';
import { Store } from 'redux';
import { Actions, State } from '../../../modules';
import FetchObject from '../../FetchObject';
import styled from '../../styled';
import TreeEntry from '../TreeEntry';

type OwnProps = {
  oid: string;
  treeObject?: TreeObjectType | null;
};

export type ObjectLinkProps = OwnProps;

export function TreeObject({ oid, treeObject }: ObjectLinkProps) {
  if (treeObject == null) {
    return <Text>null object. {oid}</Text>;
  }

  const entries = treeObject.content.map((entry) => (
    <FetchObject key={entry.path} oid={entry.oid}>
      <TreeEntry treeEntry={entry} />
    </FetchObject>
  ));

  return <Wrapper>{entries}</Wrapper>;
}

const Wrapper = styled.View`
  margin-left: 1rem;
`;

export default function(ownProps: OwnProps) {
  const store: Store<State, Actions> = useStore();
  const {
    domain: { objectManager },
  } = store.getState();
  const treeObject = objectManager[ownProps.oid] as TreeObjectType;

  return (
    <FetchObject oid={ownProps.oid}>
      <TreeObject {...ownProps} treeObject={treeObject} />
    </FetchObject>
  );
}
