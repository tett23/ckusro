import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import useSideMenusStyles from '../../../useSideMenusStyles';
import { useSelector } from 'react-redux';
import { State } from '../../../../../../modules';
import { IconButton, DialogContentText } from '@material-ui/core';
import { createRepositoriesManager } from '../../../../../../models/RepositoriesManager';
import ConfirmDialog from '../../../../../shared/DangerButton/ConfirmDialog';

type StateProps = {
  disabled: boolean;
  isDialogOpen: boolean;
};

type DispatchProps = {
  onClick: () => void;
  onClickCancel: () => void;
  onClickDelete: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type RemoveButtonProps = StateProps & DispatchProps & StyleProps;

export function RemoveButton({
  disabled,
  isDialogOpen,
  onClick,
  onClickCancel,
  onClickDelete,
  classes,
}: RemoveButtonProps) {
  const confirmBody = (
    <DialogContentText>
      Your changes will be lost if you don&apos;t commit them. This operation
      can be canceled.
    </DialogContentText>
  );

  return (
    <>
      <IconButton
        className={classes.iconWrapper}
        disabled={disabled}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faTrashAlt} className={classes.icon} />
      </IconButton>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onOk={onClickDelete}
        onCancel={onClickCancel}
        title="Are you sure?"
        body={confirmBody}
        submitText="Delete"
      />
    </>
  );
}

export default function() {
  return <RemoveButton {...buildRemoveButtonProps()} />;
}

export function buildRemoveButtonProps(): RemoveButtonProps {
  const { bufferInfo } = useSelector((state: State) => {
    const bufferInfo = state.ui.mainView.objectView.bufferInfo;
    if (
      bufferInfo == null ||
      bufferInfo.type === 'commit' ||
      bufferInfo.type === 'tag'
    ) {
      return {
        bufferInfo: null,
        entryStatus: null,
      };
    }

    const entryStatus = createRepositoriesManager(
      state.domain.repositories,
    ).entryStatus(bufferInfo.internalPath);

    return {
      bufferInfo,
      entryStatus,
    };
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatchProps: DispatchProps = {
    onClick: () => {
      setIsDialogOpen(true);
    },
    onClickCancel: () => {
      setIsDialogOpen(false);
    },
    onClickDelete: () => {
      setIsDialogOpen(false);
    },
  };
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  const stateProps: StateProps = {
    disabled: bufferInfo == null || ['commit', 'tag'].includes(bufferInfo.type),
    isDialogOpen,
  };

  return {
    ...stateProps,
    ...dispatchProps,
    ...styleProps,
  };
}
