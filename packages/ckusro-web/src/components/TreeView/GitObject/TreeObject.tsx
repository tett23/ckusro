import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';
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

  return <View>{entries}</View>;
}

function mapStateToProps(
  { domain: { objectManager } }: State,
  { oid }: OwnProps,
) {
  const treeObject = objectManager[oid] as TreeObjectType;
  return {
    oid,
    treeObject,
  };
}

export default connect(mapStateToProps)(TreeObject);
