import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../modules/thunkActions';
import { Text } from './index';

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
  return <Text onClick={updateCurrentOid}>{children}</Text>;
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
