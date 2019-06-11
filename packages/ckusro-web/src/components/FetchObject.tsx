import React, { ReactNode, useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, State } from '../modules';
import { fetchObject } from '../modules/thunkActions';

type OwnProps = {
  oid: string | null;
  children: ReactNode;
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type FetchObjectProps = OwnProps & DispatchProps;

export function FetchObject({ oid, children, fetchObject }: FetchObjectProps) {
  useEffect(() => {
    if (oid == null) {
      return;
    }

    fetchObject(oid);
  }, [oid]);

  return <>{children}</>;
}

function mapStateToProps(_: State, ownProps: OwnProps) {
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FetchObject);
