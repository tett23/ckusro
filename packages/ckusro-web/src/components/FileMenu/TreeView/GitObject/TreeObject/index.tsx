import {
  TreeObject as TreeObjectType,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { Collapse } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createObjectManager } from '../../../../../models/ObjectManager';
import { State } from '../../../../../modules';
import { updateCurrentInternalPathAndOid } from '../../../../../modules/thunkActions';
import FetchObjects from '../../../../FetchObject';
import { TreeEntries } from '../../TreeEntries';
import TreeName from './TreeName';
import { updateOpened } from '../../../../../modules/ui/fileMenu/treeView';
import { createOpenedInternalPathManager } from '../../../../../models/OpenedInternalPathManager';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type StateProps = {
  isOpened: boolean;
  treeObject: TreeObjectType;
};

type DispatchProps = {
  onClick: () => void;
  onClickSecondaryAction: () => void;
};

export type TreeObjectProps = OwnProps & StateProps & DispatchProps;

export function TreeObject({
  internalPath,
  isOpened,
  treeObject: { content },
  onClick,
  onClickSecondaryAction,
}: TreeObjectProps) {
  return (
    <>
      <TreeName
        path={createInternalPath(internalPath).basename()}
        onClick={onClick}
        isOpen={isOpened}
        onClickSecondaryAction={onClickSecondaryAction}
      />
      <Collapse in={isOpened} timeout="auto" unmountOnExit>
        <TreeEntries
          treeEntries={!isOpened ? [] : content}
          internalPath={internalPath}
        />
      </Collapse>
    </>
  );
}

export default function(props: OwnProps) {
  const { oid, internalPath } = props;

  const state = useSelector((state: State) => ({
    isOpened: createOpenedInternalPathManager(
      state.ui.fileMenu.treeView.opened,
    ).isOpened(internalPath),
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () => dispatch(updateCurrentInternalPathAndOid(internalPath, oid)),
    onClickSecondaryAction: () =>
      dispatch(updateOpened(internalPath, !state.isOpened)),
  };

  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(oid),
  );
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  return (
    <TreeObject
      {...props}
      {...state}
      treeObject={gitObject}
      {...dispatchProps}
    />
  );
}
