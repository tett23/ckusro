import React from 'react';
import { RepositoryViewTabTypes } from '../../../../modules/ui/mainView/repositoryView';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import RepositoryStage from './RepositoryStage';

type StateProps = {
  selectedTab: RepositoryViewTabTypes;
};

export type RepositoryViewContentProps = StateProps;

export function RepositoryViewContent({
  selectedTab,
}: RepositoryViewContentProps) {
  switch (selectedTab) {
    case 'CommitLogs':
      return <CommitLog />;
    case 'Stage':
      return <RepositoryStage />;
    default:
      return null;
  }
}

function CommitLog() {
  return <div />;
}

export default function () {
  const stateProps: StateProps = useSelector((state: State) => ({
    selectedTab: state.ui.mainView.repositoryView.selectedTab,
  }));

  return <RepositoryViewContent {...stateProps} />;
}
