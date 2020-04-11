import React, { useState, ReactNode } from 'react';
import { Button } from '@material-ui/core';
import useDangerButtoStyles from './useDangerButtonStyles';
import ConfirmDialog from './ConfirmDialog';

type OwnProps = {
  onOk: () => void;
  onCancel?: () => void;
  buttonContent: ReactNode;
  confirmTitle: ReactNode;
  confirmBody: ReactNode;
};

type StateProps = {
  isOpen: boolean;
};

type DispatchProps = {
  setIsOpen: (value: boolean) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useDangerButtoStyles>;
};

export type DangerButtonProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function DangerButton({
  setIsOpen,
  isOpen,
  buttonContent,
  confirmTitle,
  confirmBody,
  onOk,
  onCancel,
  classes,
}: DangerButtonProps) {
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setIsOpen(true)}
        className={classes.dangerButton}
      >
        {buttonContent}
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        title={confirmTitle}
        body={confirmBody}
        onOk={() => {
          setIsOpen(false);
          onOk();
        }}
        onCancel={() => {
          setIsOpen(false);
          onCancel && onCancel();
        }}
      />
    </>
  );
}

export default function (props: OwnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatchProps: DispatchProps = {
    setIsOpen,
  };
  const stateProps: StateProps = {
    isOpen,
  };
  const styleProps: StyleProps = {
    classes: useDangerButtoStyles(),
  };

  return (
    <DangerButton
      {...props}
      {...stateProps}
      {...dispatchProps}
      {...styleProps}
    />
  );
}
