import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import { Paper } from '@material-ui/core';
import RepositoryHeader from './RepositoryHeader';
import RepositoryViewContent from './RepositoryViewContent';
import RepositoryViewTabs from './RepositoryViewTabs';

export function RepositoryView() {
  return (
    <Paper>
      <RepositoryHeader />
      <RepositoryViewTabs />
      <RepositoryViewContent />
    </Paper>
  );
}

export default function() {
  const { repositoryInfo } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
  }));
  if (repositoryInfo == null) {
    return null;
  }

  return <RepositoryView />;
}
