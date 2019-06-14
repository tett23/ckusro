import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';
import TreeEntry from '../TreeEntry';

type OwnProps = {
  oid: string;
};

type StateProps = {
  treeObject: TreeObjectType;
};

export type TreeObjectProps = OwnProps & StateProps;

export function TreeObject({ treeObject }: TreeObjectProps) {
  if (treeObject == null) {
    return null;
  }

  const entries = treeObject.content.map((item) => (
    <TreeEntry key={item.oid + item.path} treeEntry={item} />
  ));

  return <View>{entries}</View>;
}

export default function(ownProps: OwnProps) {
  const objectManager = useSelector(
    (state: State) => state.domain.objectManager,
  );
  const gitObject = objectManager[ownProps.oid] as TreeObjectType;
  if (gitObject == null) {
    return <FetchObject oid={ownProps.oid} />;
  }

  return (
    <FetchObject oid={ownProps.oid}>
      <TreeObject {...ownProps} treeObject={gitObject} />
    </FetchObject>
  );
}
