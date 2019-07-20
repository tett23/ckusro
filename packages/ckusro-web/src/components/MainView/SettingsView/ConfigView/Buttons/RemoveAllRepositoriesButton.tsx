import React from 'react';
import { useDispatch } from 'react-redux';
import DangerButton from '../../../../shared/DangerButton';
import { Typography } from '@material-ui/core';
import { removeAllRepositories } from '../../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type RemoveAllRepositoriesButtonProps = DispatchProps;

export function RemoveAllRepositoriesButton({
  onClick,
}: RemoveAllRepositoriesButtonProps) {
  const confirmBody = (
    <Typography>
      All repositories will be deleted. This operation can not be undone.
    </Typography>
  );

  return (
    <DangerButton
      onOk={onClick}
      buttonContent="Remove all repositories"
      confirmTitle="Are you sure?"
      confirmBody={confirmBody}
    />
  );
}

export default function() {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => dispatch(removeAllRepositories()),
  };

  return <RemoveAllRepositoriesButton {...dispatchProps} />;
}
