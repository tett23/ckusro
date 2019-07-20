import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import {
  RepositoryViewTabTypes,
  updateSelectedTab,
} from '../../../modules/ui/mainView/repositoryView';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../modules';

type StateProps = {
  selectedTab: RepositoryViewTabTypes;
};

type DispatchProps = {
  onClickTab: (value: RepositoryViewTabTypes) => void;
};

export type RepositoryViewTabsProps = StateProps & DispatchProps;

export function RepositoryViewTabs({
  selectedTab,
  onClickTab,
}: RepositoryViewTabsProps) {
  return (
    <Tabs value={selectedTab} indicatorColor="primary" textColor="primary">
      <Tab
        value="Stage"
        onClick={() => onClickTab('Stage')}
        label="Editing files"
      />
      <Tab
        value="CommitLogs"
        onClick={() => onClickTab('CommitLogs')}
        label="Commit logs"
      />
    </Tabs>
  );
}

export default function() {
  const stateProps: StateProps = useSelector((state: State) => ({
    selectedTab: state.ui.mainView.repositoryView.selectedTab,
  }));
  const dispatch = useDispatch();
  const dispatchProps: DispatchProps = {
    onClickTab: (value: RepositoryViewTabTypes) =>
      dispatch(updateSelectedTab(value)),
  };

  return <RepositoryViewTabs {...stateProps} {...dispatchProps} />;
}
