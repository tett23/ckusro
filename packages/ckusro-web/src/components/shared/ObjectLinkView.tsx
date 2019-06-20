import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../modules/thunkActions';
import { TouchableWithoutFeedback } from './index';

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
  return (
    <TouchableWithoutFeedback onPress={updateCurrentOid}>
      {children}
    </TouchableWithoutFeedback>
  );
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
