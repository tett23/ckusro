import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { updateByBufferInfo } from '../../modules/thunkActions';
import { BufferInfo } from '../../models/BufferInfo';

type OwnProps = {
  bufferInfo: BufferInfo;
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
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateByBufferInfo(ownProps.bufferInfo));
    },
  };

  return <ObjectLinkView {...ownProps} {...actions} />;
}
