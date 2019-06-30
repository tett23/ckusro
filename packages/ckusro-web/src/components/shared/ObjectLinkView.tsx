import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentInternalPathAndOid } from '../../modules/thunkActions';
import { InternalPath } from '@ckusro/ckusro-core';

type OwnProps = {
  oid: string | null;
  internalPath: InternalPath;
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
  const { oid, internalPath } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateCurrentInternalPathAndOid(internalPath, oid));
    },
  };

  return <ObjectLinkView {...ownProps} {...actions} />;
}
