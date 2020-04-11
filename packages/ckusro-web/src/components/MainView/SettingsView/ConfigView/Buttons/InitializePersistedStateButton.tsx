import React from 'react';
import { useDispatch } from 'react-redux';
import DangerButton from '../../../../shared/DangerButton';
import { DialogContentText } from '@material-ui/core';
import { initializePersistedState } from '../../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type InitializePersistedStateButtonProps = DispatchProps;

export function InitializePersistedStateButton({
  onClick,
}: InitializePersistedStateButtonProps) {
  const confirmBody = (
    <DialogContentText>
      Initialize the settings. This operation can not be undone.
    </DialogContentText>
  );

  return (
    <DangerButton
      onOk={onClick}
      buttonContent="Initialize config"
      confirmTitle="Are you sure?"
      confirmBody={confirmBody}
    />
  );
}

export default function () {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => dispatch(initializePersistedState()),
  };

  return <InitializePersistedStateButton {...dispatchProps} />;
}
