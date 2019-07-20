import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import { createRefManager } from '../../../../models/RefManager';
import CloneButton from './CloneButton';
import PullButton from './PullButton';

type StateProps = {
  isCloned: boolean;
};

export type CloneOrPullButtonProps = StateProps;

export function CloneOrPullButton({ isCloned }: CloneOrPullButtonProps) {
  if (isCloned) {
    return <PullButton />;
  }

  return <CloneButton />;
}

export default function() {
  const { repositoryInfo, refManager } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
    refManager: createRefManager(state.domain.refManager),
  }));
  if (repositoryInfo == null) {
    return null;
  }

  const headOid = refManager.headOid(repositoryInfo.repoPath);
  const stateProps: StateProps = {
    isCloned: headOid != null,
  };

  return <CloneOrPullButton {...stateProps} />;
}
