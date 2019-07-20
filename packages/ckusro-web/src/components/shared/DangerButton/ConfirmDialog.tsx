import React, { ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import useDangerButtonStyles from './useDangerButtonStyles';

type OwnProps = {
  isOpen: boolean;
  title: ReactNode;
  body: ReactNode;
  onOk: () => void;
  onCancel?: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useDangerButtonStyles>;
};

export type ConfirmDialogProps = OwnProps & StyleProps;

export function ConfirmDialog({
  title,
  body,
  onOk,
  onCancel,
  classes,
}: ConfirmDialogProps) {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{body}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} className={classes.grayButton}>
          Cancel
        </Button>
        <Button
          onClick={onOk}
          variant="contained"
          className={classes.dangerButton}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function(props: OwnProps) {
  const styleProps: StyleProps = {
    classes: useDangerButtonStyles(),
  };

  if (!props.isOpen) {
    return null;
  }

  return <ConfirmDialog {...props} {...styleProps} />;
}
