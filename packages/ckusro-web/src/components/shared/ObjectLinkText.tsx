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

export type ObjectLinkTextProps = OwnProps & DispatchProps;

export function ObjectLinkText({
  children,
  updateCurrentOid,
}: ObjectLinkTextProps) {
  return <span onClick={updateCurrentOid}>{children}</span>;
}

export default function(ownProps: OwnProps) {
  const { oid, internalPath } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateCurrentInternalPathAndOid(internalPath, oid));
    },
  };

  return <ObjectLinkText {...ownProps} {...actions} />;
}
