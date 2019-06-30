import {
  CommitObject,
  url2RepoPath,
  RepoPath,
  InternalPath,
} from '@ckusro/ckusro-core';
import { Collapse, Box } from '@material-ui/core';
import React from 'react';
import { Repository } from '../../../../models/Repository';
import TreeEntries from '../TreeEntries';
import RepositoryName from './RepositoryName';
import { useDispatch, useSelector } from 'react-redux';
import { updateOpened } from '../../../../modules/ui/fileMenu/treeView';
import { State } from '../../../../modules';
import { createOpenedInternalPathManager } from '../../../../models/OpenedInternalPathManager';

type OwnProps = {
  repository: Repository;
  commitObject: CommitObject;
};

type StateProps = {
  isOpen: boolean;
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: () => void;
};

export type ClonedProps = OwnProps & StateProps & DispatchProps;

export function Cloned({
  repository,
  commitObject: {
    oid,
    content: { tree },
  },
  isOpen,
  internalPath,
  onClick,
}: ClonedProps) {
  return (
    <Box>
      <RepositoryName repository={repository} headOid={oid} onClick={onClick} />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TreeEntries oid={tree} internalPath={internalPath} />
      </Collapse>
    </Box>
  );
}

export default function(props: OwnProps) {
  const state = useSelector((state: State) => {
    const repoPath = url2RepoPath(props.repository.url) as RepoPath;
    const internalPath = { repoPath, path: '/' };

    return {
      internalPath,
      isOpen: createOpenedInternalPathManager(
        state.ui.fileMenu.treeView.opened,
      ).isOpened(internalPath),
    };
  });
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => {
      dispatch(updateOpened(state.internalPath, !state.isOpen));
    },
  };

  return <Cloned {...props} {...state} {...dispatchProps} />;
}
