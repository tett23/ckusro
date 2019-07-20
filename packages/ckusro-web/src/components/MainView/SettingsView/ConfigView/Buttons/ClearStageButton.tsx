import React from 'react';
import { useDispatch } from 'react-redux';
import DangerButton from '../../../../shared/DangerButton';
import { Typography } from '@material-ui/core';
import { clearStageData } from '../../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type ClearStageButton = DispatchProps;

export function ClearStageButton({ onClick }: ClearStageButton) {
  const confirmBody = (
    <Typography>
      All editing data is discarded. This operation can not be undone.
    </Typography>
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
