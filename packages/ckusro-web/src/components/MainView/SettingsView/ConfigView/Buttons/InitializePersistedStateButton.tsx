import React from 'react';
import { useDispatch } from 'react-redux';
import DangerButton from '../../../../shared/DangerButton';
import { Typography } from '@material-ui/core';
import { initializePersistedState } from '../../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type InitializePersistedStateButtonProps = DispatchProps;

export function InitializePersistedStateButton({
  onClick,
}: InitializePersistedStateButtonProps) {
  const confirmBody = (
    <Typography>
      Initialize the settings. This operation can not be undone.
    </Typography>
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

export default function() {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => dispatch(initializePersistedState()),
  };

  return <InitializePersistedStateButton {...dispatchProps} />;
}
