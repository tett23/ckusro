import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../modules/thunkActions';

type OwnProps = {
  oid: string | null;
  children: ReactNode;
};

type DispatchProps = {
  updateCurrentOid: () => void;
};

export type ObjectLinkViewProps = OwnProps & DispatchProps;

export function ObjectLinkView({
  children,
  updateCurrentOid,
}: ObjectLinkViewProps) {
  return <div onClick={updateCurrentOid}>{children}</div>;
}

export default function(ownProps: OwnProps) {
  const { oid } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateCurrentOid(oid));
    },
  };

  return <ObjectLinkView {...ownProps} {...actions} />;
}
