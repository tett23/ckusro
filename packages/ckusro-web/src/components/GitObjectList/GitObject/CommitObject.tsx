import {
  CommitObject as CommitObjectType,
  GitObject,
} from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import { View, Text } from '../../shared';

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
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[ownProps.oid],
  );

  if (gitObject == null) {
    return <FetchObjects oids={[ownProps.oid]} />;
  }

  return (
    <CommitObject {...ownProps} commitObject={gitObject as CommitObjectType} />
  );
}
