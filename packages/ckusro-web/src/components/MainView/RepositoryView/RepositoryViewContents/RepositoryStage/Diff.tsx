import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../../../modules';
import { InternalPath, TreeEntry } from '@ckusro/ckusro-core';

type StateProps = {
  internalPath: InternalPath;
  treeEntry: TreeEntry;
};

type DispatchProps = {};

export type DiffProps = StateProps & DispatchProps;

export function Diff({ internalPath }: DiffProps) {
  return <>{internalPath.path}</>;
}

export default function() {
  const { repositoryInfo, selectedStageEntry } = useSelector(
    (state: State) => ({
      repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
      selectedStageEntry: state.ui.mainView.repositoryView.selectedStageEntry,
    }),
  );
  if (repositoryInfo == null || selectedStageEntry == null) {
    return null;
  }

  const [internalPath, treeEntry] = selectedStageEntry;

  const stateProps: StateProps = {
    internalPath,
    treeEntry,
  };

  return <Diff {...stateProps} />;
}
