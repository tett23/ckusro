import React from 'react';
import { RepoPath } from '@ckusro/ckusro-core';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';

type StateProps = {
  repoPath: RepoPath;
};

export type RepositoryView = StateProps;

export function RepositoryView({ repoPath }: RepositoryView) {
  return <div>{repoPath.name}</div>;
}

export default function() {
  const { repoPath } = useSelector((state: State) => ({
    repoPath: state.ui.mainView.repositoryView.repoPath,
  }));
  if (repoPath == null) {
    return null;
  }

  const stateProps: StateProps = {
    repoPath,
  };

  return <RepositoryView {...stateProps} />;
}
