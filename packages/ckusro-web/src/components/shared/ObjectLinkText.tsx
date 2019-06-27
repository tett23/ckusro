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

export type ObjectLinkTextProps = OwnProps & DispatchProps;

export function ObjectLinkText({
  children,
  updateCurrentOid,
}: ObjectLinkTextProps) {
  return <span onClick={updateCurrentOid}>{children}</span>;
}

export default function(ownProps: OwnProps) {
  const { oid } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateCurrentOid(oid));
    },
  };

  return <ObjectLinkText {...ownProps} {...actions} />;
}
