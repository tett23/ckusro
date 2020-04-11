import { InternalPath, TreeEntry } from '@ckusro/ckusro-core';
import { Collapse } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../../../modules';
import { updateByBufferInfo } from '../../../../../modules/thunkActions';
import { TreeEntries } from '../../TreeEntries';
import TreeName from './TreeName';
import { updateOpened } from '../../../../../modules/ui/fileMenu/treeView';
import { createOpenedInternalPathManager } from '../../../../../models/OpenedInternalPathManager';
import { createBufferInfo } from '../../../../../models/BufferInfo';
import { createRepositoriesManager } from '../../../../../models/RepositoriesManager';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type StateProps = {
  isOpened: boolean;
  treeEntries: TreeEntry[];
};

type DispatchProps = {
  onClick: () => void;
  onClickSecondaryAction: () => void;
};

export type TreeObjectProps = OwnProps & StateProps & DispatchProps;

export function TreeObject({
  internalPath,
  isOpened,
  treeEntries,
  onClick,
  onClickSecondaryAction,
}: TreeObjectProps) {
  return (
    <>
      <TreeName
        internalPath={internalPath}
        onClick={onClick}
        isOpen={isOpened}
        onClickSecondaryAction={onClickSecondaryAction}
      />
      <Collapse in={isOpened} timeout="auto" unmountOnExit>
        <TreeEntries
          treeEntries={!isOpened ? [] : treeEntries}
          internalPath={internalPath}
        />
      </Collapse>
    </>
  );
}

export default function (props: OwnProps) {
  const { oid, internalPath } = props;

  const { isOpened, treeEntries } = useSelector((state: State) => {
    const isOpened = createOpenedInternalPathManager(
      state.ui.fileMenu.treeView.opened,
    ).isOpened(internalPath);
    const treeEntries = !isOpened
      ? []
      : createRepositoriesManager(
          state.domain.repositories,
        ).fetchCurrentTreeEntries(internalPath);

    return {
      isOpened,
      treeEntries,
    };
  });
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () =>
      dispatch(updateByBufferInfo(createBufferInfo('tree', oid, internalPath))),
    onClickSecondaryAction: () =>
      dispatch(updateOpened(internalPath, !isOpened)),
  };

  const stateProps: StateProps = {
    isOpened,
    treeEntries,
  };

  return <TreeObject {...props} {...stateProps} {...dispatchProps} />;
}
