import { TreeEntry } from '@ckusro/ckusro-core';
import React, { ReactNode, useEffect } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, State } from '../../modules';
import { updateCurrentOid } from '../../modules/objectView';
import { fetchObject } from '../../modules/thunkActions';

type ObjectLinkOwnProps = {
  oid: string;
  treeEntry?: TreeEntry | null;
  children: ReactNode;
};

type ObjectLinkDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type ObjectLinkProps = ObjectLinkOwnProps & ObjectLinkDispatchProps;

export function ObjectLink({
  oid,
  children,
  fetchObject,
  updateCurrentOid,
}: ObjectLinkProps) {
  useEffect(() => {
    fetchObject(oid);
  }, [oid]);

  return <Text onPress={() => updateCurrentOid(oid)}>{children || oid}</Text>;
}

function mapStateToProps(_: State, ownProps: ObjectLinkOwnProps) {
  return {
    ...ownProps,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, undefined, Actions>,
) {
  return {
    fetchObject(oid: string) {
      dispatch(fetchObject(oid));
    },
    updateCurrentOid(oid: string | null) {
      dispatch(updateCurrentOid(oid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectLink);
