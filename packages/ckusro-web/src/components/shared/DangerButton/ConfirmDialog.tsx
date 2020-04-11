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
  submitText?: string;
};

type StyleProps = {
  classes: ReturnType<typeof useDangerButtonStyles>;
};

export type ConfirmDialogProps = OwnProps & StyleProps;

export function ConfirmDialog({
  title,
  body,
  submitText,
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
          {submitText || 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function (ownProps: OwnProps) {
  const props = buildConfirmDialogProps(ownProps);

  if (!ownProps.isOpen) {
    return null;
  }

  return <ConfirmDialog {...props} />;
}

function buildConfirmDialogProps(props: OwnProps): ConfirmDialogProps {
  const styleProps: StyleProps = {
    classes: useDangerButtonStyles(),
  };

  return {
    ...props,
    ...styleProps,
  };
}
