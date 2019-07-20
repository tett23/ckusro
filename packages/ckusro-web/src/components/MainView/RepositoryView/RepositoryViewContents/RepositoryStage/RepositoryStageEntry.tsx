import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../../modules';
import { createStageManager } from '../../../../../models/StageEntryManager';
import { InternalPath, TreeEntry } from '@ckusro/ckusro-core';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { updateSelectedStageEntry } from '../../../../../modules/ui/mainView/repositoryView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import useRepositoryStageStyles from './useRepositoryStageStyles';

type OwnProps = {
  internalPath: InternalPath;
  treeEntry: TreeEntry;
};

type StateProps = {
  internalPath: InternalPath;
  treeEntry: TreeEntry;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useRepositoryStageStyles>;
};

export type RepositoryStageEntryProps = StateProps & DispatchProps & StyleProps;

export function RepositoryStageEntry({
  internalPath,
  onClick,
  classes,
}: RepositoryStageEntryProps) {
  return (
    <ListItem button dense onClick={onClick}>
      <ListItemIcon className={classes.fileTypeIcon}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText>{internalPath.path}</ListItemText>
    </ListItem>
  );
}

export default function({ internalPath, treeEntry }: OwnProps) {
  const { repositoryInfo } = useSelector((state: State) => ({
    repositoryInfo: state.ui.mainView.repositoryView.repositoryInfo,
    stageManager: createStageManager(state.domain.stageManager),
  }));
  const dispatch = useDispatch();
  const styleProps: StyleProps = {
    classes: useRepositoryStageStyles(),
  };
  if (repositoryInfo == null) {
    return null;
  }

  const stateProps: StateProps = {
    internalPath,
    treeEntry,
  };
  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(updateSelectedStageEntry([internalPath, treeEntry]));
    },
  };

  return (
    <RepositoryStageEntry {...stateProps} {...dispatchProps} {...styleProps} />
  );
}
