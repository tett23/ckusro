import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  FormHelperText,
} from '@material-ui/core';
import useAddRepositoryDialogStyles from './useAddRepositoryDialogStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addRepository } from '../../modules/config';
import {
  url2RepoPath,
  RepositoryInfo,
  compareRepoPath,
} from '@ckusro/ckusro-core';
import { State } from '../../modules';

type OwnProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

type StateProps = {
  url: string;
  errorMessage: string | null;
};

type DispatchProps = {
  onClickOk: () => void;
  onClickClose: () => void;
  onChangeUrl: (url: string) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useAddRepositoryDialogStyles>;
};

export type AddRepositoryDialogProps = StateProps & DispatchProps & StyleProps;

export function AddRepositoryDialog({
  url,
  errorMessage,
  onClickOk,
  onClickClose,
  onChangeUrl,
  classes,
}: AddRepositoryDialogProps) {
  const hasError = errorMessage != null;
  const disabled = url.length === 0 || hasError;

  return (
    <Dialog open aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Clone repository</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Repository URL"
          type="text"
          placeholder="https://github.com/tett23/ckusro"
          defaultValue={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          aria-describedby="component-error-text"
          error={hasError}
          fullWidth
        />
        <FormHelperText id="component-error-text">
          {errorMessage}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose} className={classes.grayButton}>
          Cancel
        </Button>
        <Button
          onClick={onClickOk}
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ({ isOpen, setIsOpen }: OwnProps) {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stateProps: StateProps = {
    url,
    errorMessage,
  };
  const { repositories } = useSelector((state: State) => ({
    repositories: state.config.repositories,
  }));
  const styleProps: StyleProps = {
    classes: useAddRepositoryDialogStyles(),
  };
  const dispatch = useDispatch();
  const dispatchProps: DispatchProps = {
    onClickOk: () => {
      const repoPath = url2RepoPath(url.trim());
      if (repoPath instanceof Error) {
        return;
      }
      dispatch(
        addRepository({
          url: url.trim(),
          repoPath,
        }),
      );
      setUrl('');
      setErrorMessage(null);
      setIsOpen(false);
    },
    onClickClose: () => {
      setUrl('');
      setErrorMessage(null);
      setIsOpen(false);
    },
    onChangeUrl: (value: string) => {
      setUrl(value);
      setErrorMessage(validateUrl(value, repositories));
    },
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AddRepositoryDialog {...stateProps} {...dispatchProps} {...styleProps} />
  );
}

function validateUrl(
  url: string,
  repositories: RepositoryInfo[],
): string | null {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath.message;
  }

  const isExist = repositories.some((item) =>
    compareRepoPath(item.repoPath, repoPath),
  );
  if (isExist) {
    return 'Repository is already cloned';
  }

  return null;
}
