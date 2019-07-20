import React from 'react';
import { useDispatch } from 'react-redux';
import DangerButton from '../../../../shared/DangerButton';
import { DialogContentText } from '@material-ui/core';
import { clearStageData } from '../../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type ClearStageButtonProps = DispatchProps;

export function ClearStageButton({ onClick }: ClearStageButtonProps) {
  const confirmBody = (
    <DialogContentText>
      All editing data is discarded. This operation can not be undone.
    </DialogContentText>
  );

  return (
    <DangerButton
      onOk={onClick}
      buttonContent="Clear staging data"
      confirmTitle="Are you sure?"
      confirmBody={confirmBody}
    />
  );
}

export default function() {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => dispatch(clearStageData()),
  };

  return <ClearStageButton {...dispatchProps} />;
}
