import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../../modules';
import { cloneRepository } from '../../../../../modules/thunkActions';
import { InternalPathEntry } from '@ckusro/ckusro-core';
import RepositoryStageEntry from './RepositoryStageEntry';
import { List } from '@material-ui/core';
import Diff from './Diff';
import { createPathManager } from '../../../../../models/PathManager';

type StateProps = {
  internalPathEntries: InternalPathEntry[];
};

type DispatchProps = {
  onClick: () => void;
};

export type RepositoryStageProps = StateProps & DispatchProps;

export function RepositoryStage({ internalPathEntries }: RepositoryStageProps) {
  const items = internalPathEntries.map(([internalPath, treeEntry]) => (
    <RepositoryStageEntry
      key={internalPath.path + treeEntry.oid}
      internalPath={internalPath}
      treeEntry={treeEntry}
    />
  ));

  return (
    <>
      <List>{items}</List>
      <Diff />
    </>
  );
}

export default function() {
  const { repositoryInfo, stageManager } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
    stageManager: createPathManager(state.domain.repositories.stagePathCache),
  }));
  const dispatch = useDispatch();
  if (repositoryInfo == null) {
    return null;
  }

  const filtered = createPathManager(
    stageManager.filterRepository(repositoryInfo.repoPath),
  ).filterBlob();
  const stateProps: StateProps = {
    internalPathEntries: filtered,
  };
  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(cloneRepository(repositoryInfo.url));
    },
  };

  return <RepositoryStage {...stateProps} {...dispatchProps} />;
}
