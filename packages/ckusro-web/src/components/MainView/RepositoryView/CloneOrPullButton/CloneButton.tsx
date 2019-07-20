import React from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../modules';
import { cloneRepository } from '../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type CloneButton = DispatchProps;

export function CloneButton({ onClick }: CloneButton) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Clone
    </Button>
  );
}

export default function() {
  const { repositoryInfo } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
  }));
  const dispatch = useDispatch();
  if (repositoryInfo == null) {
    return null;
  }

  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(cloneRepository(repositoryInfo.url));
    },
  };

  return <CloneButton {...dispatchProps} />;
}
