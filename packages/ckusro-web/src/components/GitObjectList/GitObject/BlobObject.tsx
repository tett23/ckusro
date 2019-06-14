import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  blobObject: BlobObjectType | null;
};

export type BlobObjectProps = OwnProps & StateProps;

export function BlobObject({ path, blobObject }: BlobObjectProps) {
  if (blobObject == null) {
    return null;
  }
  const content = new TextDecoder().decode(blobObject.content);
  const headline = content.slice(0, 100).replace(/(\r\n|\r|\n)/g, ' ');

  return (
    <View>
      <Text>{path}</Text>
      <Text>{headline}</Text>
    </View>
  );
}

export default function(ownProps: OwnProps) {
  const objectManager = useSelector(
    (state: State) => state.domain.objectManager,
  );
  const gitObject = objectManager[ownProps.oid] as BlobObjectType;

  return (
    <FetchObject oid={ownProps.oid}>
      <BlobObject {...ownProps} blobObject={gitObject} />
    </FetchObject>
  );
}
