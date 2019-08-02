import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import useSideMenusStyles from '../../useSideMenusStyles';
import { useSelector } from 'react-redux';
import { State } from '../../../../../modules';
import { IconButton, Popper, Fade, Paper, Typography } from '@material-ui/core';

type StateProps = {
  disabled: boolean;
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
};

type DispatchProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type InfoButtonProps = StateProps & DispatchProps & StyleProps;

export function InfoButton({
  disabled,
  isOpen,
  anchorEl,
  onClick,
  classes,
}: InfoButtonProps) {
  return (
    <>
      <IconButton
        className={classes.iconWrapper}
        disabled={disabled}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faInfoCircle} className={classes.icon} />
      </IconButton>
      <BufferInfoPopper isOpen={isOpen} anchorEl={anchorEl} />
    </>
  );
}

export default function() {
  return <InfoButton {...buildProps()} />;
}

export function buildProps() {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const { bufferInfo } = useSelector((state: State) => {
    const bufferInfo = state.ui.mainView.objectView.bufferInfo;
    if (bufferInfo == null) {
      return {};
    }

    return {
      bufferInfo: state.ui.mainView.objectView.bufferInfo,
    };
  });
  const disabled = bufferInfo == null || bufferInfo.type != 'blob';
  const stateProps: StateProps = {
    disabled: disabled,
    isOpen: !disabled && isOpen,
    anchorEl,
  };
  const dispatchProps: DispatchProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAnchorEl(e.currentTarget);
      setIsOpen(!isOpen);
    },
  };
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return {
    ...stateProps,
    ...dispatchProps,
    ...styleProps,
  };
}

type BufferInfoPopperProps = {
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
};
function BufferInfoPopper({ isOpen, anchorEl }: BufferInfoPopperProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Popper open={isOpen} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <Typography>The content of the Popper.</Typography>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
