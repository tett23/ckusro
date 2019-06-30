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

export type ObjectLinkTextProps = OwnProps & DispatchProps;

export function ObjectLinkText({
  children,
  updateCurrentOid,
}: ObjectLinkTextProps) {
  return <span onClick={updateCurrentOid}>{children}</span>;
}

export default function(ownProps: OwnProps) {
  const dispatch = useDispatch();
  const actions = {
    updateCurrentOid() {
      dispatch(updateByBufferInfo(ownProps.bufferInfo));
    },
  };

  return <ObjectLinkText {...ownProps} {...actions} />;
}
