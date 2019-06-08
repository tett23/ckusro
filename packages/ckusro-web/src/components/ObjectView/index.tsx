import { GitObject } from '@ckusro/ckusro-core';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, State } from '../../modules';
import { fetchObject } from '../../modules/thunkActions';

type ObjectViewStates = {
  oid: string | null;
  object: GitObject | null;
};

export type ObjectViewProps = ObjectViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function ObjectView({ oid, object, fetchObject }: ObjectViewProps) {
  useEffect(() => {
    if (oid == null) {
      return;
    }

    fetchObject(oid);
  }, [oid]);

  if (oid == null) {
    return <EmptyObjectView />;
  }
  if (object == null) {
    return <ObjectNotFound oid={oid} />;
  }

  return (
    <View>
      <Text>oid: {oid}</Text>
      <Text>type: {object.type}</Text>
    </View>
  );
}

function EmptyObjectView() {
  return (
    <View>
      <Text>EmptyObjectView</Text>
    </View>
  );
}

type ObjectNotFoundProps = {
  oid: string;
};

function ObjectNotFound({ oid }: ObjectNotFoundProps) {
  return (
    <View>
      <Text>ObjectNotFound. oid={oid}</Text>
    </View>
  );
}

function mapStateToProps({
  domain: { objectManager },
  objectView: { currentOid },
}: State): ObjectViewStates {
  return {
    oid: currentOid,
    object: currentOid == null ? null : objectManager[currentOid],
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, undefined, Actions>,
) {
  return {
    fetchObject(oid: string) {
      dispatch(fetchObject(oid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectView);
