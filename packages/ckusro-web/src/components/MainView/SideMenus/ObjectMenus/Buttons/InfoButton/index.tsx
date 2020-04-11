import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import useSideMenusStyles from '../../../useSideMenusStyles';
import { useSelector } from 'react-redux';
import { State } from '../../../../../../modules';
import { IconButton, ClickAwayListener } from '@material-ui/core';
import BufferInfoPopper from './BufferInfoPopper';
import { BufferInfo } from '@ckusro/ckusro-core';

type StateProps = {
  bufferInfo: BufferInfo | null;
  disabled: boolean;
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
};

type DispatchProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closePopper: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type InfoButtonProps = StateProps & DispatchProps & StyleProps;

export function InfoButton({
  bufferInfo,
  disabled,
  isOpen,
  anchorEl,
  onClick,
  closePopper,
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
      {bufferInfo && isOpen && (
        <ClickAwayListener onClickAway={closePopper}>
          <div>
            <BufferInfoPopper
              isOpen={isOpen}
              bufferInfo={bufferInfo}
              anchorEl={anchorEl}
            />
          </div>
        </ClickAwayListener>
      )}
    </>
  );
}

export default function () {
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
    bufferInfo: bufferInfo || null,
    disabled: disabled,
    isOpen: !disabled && isOpen,
    anchorEl,
  };
  const dispatchProps: DispatchProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAnchorEl(e.currentTarget);
      setIsOpen(!isOpen);
    },
    closePopper: () => setIsOpen(false),
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
