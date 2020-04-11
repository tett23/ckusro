import React from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../modules';
import { pullRepository } from '../../../../modules/thunkActions';

type DispatchProps = {
  onClick: () => void;
};

export type PullButtonProps = DispatchProps;

export function PullButton({ onClick }: PullButtonProps) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Pull
    </Button>
  );
}

export default function () {
  const { repositoryInfo } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
  }));
  const dispatch = useDispatch();
  if (repositoryInfo == null) {
    return null;
  }

  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(pullRepository(repositoryInfo.repoPath));
    },
  };

  return <PullButton {...dispatchProps} />;
}
