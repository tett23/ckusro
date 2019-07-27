import React from 'react';
import { useSelector } from 'react-redux';
import { RepoPath, createRepoPath } from '@ckusro/ckusro-core';
import { Typography, Box } from '@material-ui/core';
import CloneOrPullButton from './CloneOrPullButton';
import { State } from '../../../modules';
import { createRefManager } from '../../../models/RefManager';

type StateProps = {
  repoPath: RepoPath;
  headOid: string | null;
};

export type RepositoryHeaderProps = StateProps;

export function RepositoryHeader({ repoPath, headOid }: RepositoryHeaderProps) {
  return (
    <Box>
      <Typography variant="h1">{repoPath.name}</Typography>
      <Typography variant="caption">
        {createRepoPath(repoPath).join()}
      </Typography>
      <Typography>{headOid}</Typography>
      <CloneOrPullButton />
    </Box>
  );
}

export default function() {
  const { repositoryInfo, refManager } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
    refManager: createRefManager(state.domain.repositories.refManager),
  }));
  if (repositoryInfo == null) {
    return null;
  }

  const headOid = refManager.headOid(repositoryInfo.repoPath);
  const stateProps: StateProps = {
    repoPath: repositoryInfo.repoPath,
    headOid,
  };

  return <RepositoryHeader {...stateProps} />;
}
