import { CommitObject as CommitObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';

type OwnProps = {
  oid: string;
};
type StateProps = {
  commitObject: CommitObjectType;
};

export type CommitObjectProps = OwnProps & StateProps;

export function CommitObject({ oid, commitObject }: CommitObjectProps) {
  if (commitObject == null) {
    return null;
  }
  const content = commitObject.content.message;

  return (
    <View>
      <Text>{oid}</Text>
      <Text>{content.slice(0, 100).replace(/\r\n/, ' ')}</Text>
    </View>
  );
}

export default function(ownProps: OwnProps) {
  const objectManager = useSelector(
    (state: State) => state.domain.objectManager,
  );
  const gitObject = objectManager[ownProps.oid] as CommitObjectType;

  if (gitObject == null) {
    return <FetchObject oid={ownProps.oid} />;
  }

  return (
    <FetchObject oid={ownProps.oid}>
      <CommitObject {...ownProps} commitObject={gitObject} />
    </FetchObject>
  );
}
