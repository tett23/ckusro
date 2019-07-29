import {
  CommitObject,
  InternalPath,
  RepositoryInfo,
  compareInternalPath,
} from '@ckusro/ckusro-core';
import { Collapse, Box } from '@material-ui/core';
import React from 'react';
import TreeEntries from '../TreeEntries';
import RepositoryName from './RepositoryName';
import { useDispatch, useSelector } from 'react-redux';
import { updateOpened } from '../../../../modules/ui/fileMenu/treeView';
import { State } from '../../../../modules';
import { createOpenedInternalPathManager } from '../../../../models/OpenedInternalPathManager';
import { createRepositoriesManager } from '../../../../models/RepositoriesManager';

type OwnProps = {
  repository: RepositoryInfo;
  commitObject: CommitObject;
};

type StateProps = {
  isOpen: boolean;
  internalPath: InternalPath;
  rootOid: string;
};

type DispatchProps = {
  onClick: () => void;
};

export type ClonedProps = OwnProps & StateProps & DispatchProps;

export function Cloned({
  repository,
  commitObject: { oid: commitOid },
  rootOid,
  isOpen,
  internalPath,
  onClick,
}: ClonedProps) {
  return (
    <Box>
      <RepositoryName
        repository={repository}
        headOid={commitOid}
        onClick={onClick}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TreeEntries oid={rootOid} internalPath={internalPath} />
      </Collapse>
    </Box>
  );
}

export default function(props: OwnProps) {
  const { internalPath, isOpen, rootOid } = useSelector((state: State) => {
    const repoPath = props.repository.repoPath;
    const internalPath = { repoPath, path: '/' };
    const tree = createRepositoriesManager(
      state.domain.repositories,
    ).currentTree(repoPath);
    const root = tree.find((item) =>
      compareInternalPath(internalPath, item.internalPath),
    );

    return {
      internalPath,
      rootOid: root == null ? null : root.changedOid || root.originalOid,
      isOpen: createOpenedInternalPathManager(
        state.ui.fileMenu.treeView.opened,
      ).isOpened(internalPath),
    };
  });
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => {
      dispatch(updateOpened(internalPath, !isOpen));
    },
  };

  if (rootOid == null) {
    return null;
  }

  const stateProps: StateProps = {
    internalPath,
    isOpen,
    rootOid,
  };

  return <Cloned {...props} {...stateProps} {...dispatchProps} />;
}
