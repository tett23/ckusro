import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';
import useSideMenusStyles from '../../useSideMenusStyles';
import { useDispatch, useSelector } from 'react-redux';
import { updateMainViewType } from '../../../../../modules/ui/mainView/mainViewMisc';
import { State } from '../../../../../modules';

type StateProps = {
  disabled: boolean;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type DiffButtonProps = StateProps & DispatchProps & StyleProps;

export function DiffButton({ disabled, onClick, classes }: DiffButtonProps) {
  return (
    <IconButton
      className={classes.iconWrapper}
      disabled={disabled}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCodeBranch} className={classes.icon} />
    </IconButton>
  );
}

export default function() {
  const { bufferInfo } = useSelector((state: State) => ({
    bufferInfo: state.ui.mainView.objectView.bufferInfo,
  }));
  const stateProps: StateProps = {
    disabled: bufferInfo == null || bufferInfo.type != 'blob',
  };
  const dispatch = useDispatch();
  const dispatchProps: DispatchProps = {
    onClick: () => dispatch(updateMainViewType('diff')),
  };
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return <DiffButton {...stateProps} {...dispatchProps} {...styleProps} />;
}
