import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../modules';
import { CkusroConfig } from '@ckusro/ckusro-core';
import {
  TextField,
  FormGroup,
  FormLabel,
  IconButton,
  Grid,
} from '@material-ui/core';
import useConfigViewStyles from './useConfigViewStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  updateCorsProxy as updateCorsProxyAction,
  updateAuthenticationGithub as updateAuthenticationGithubAction,
} from '../../../modules/config';

type OwnProps = {};

type StateProps = {
  ckusroConfig: CkusroConfig;
};

type DispatchProps = {
  updateCorsProxy: (value: string | null) => void;
  updateAuthenticationGithub: (value: string | null) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useConfigViewStyles>;
};

export type ConfigViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function ConfigView({
  ckusroConfig,
  updateCorsProxy,
  updateAuthenticationGithub,
  classes,
}: ConfigViewProps) {
  return (
    <>
      <FormGroup className={classes.formGroup}>
        <FormLabel>General</FormLabel>
        <TextField
          disabled
          label="Core ID"
          defaultValue={ckusroConfig.coreId}
          className={classes.textField}
          margin="normal"
        />
        <TextField
          disabled
          label="Base"
          defaultValue={ckusroConfig.base}
          className={classes.textField}
          margin="normal"
        />
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={11}>
            <TextField
              label="CORS Proxy"
              value={ckusroConfig.corsProxy || ''}
              placeholder={ckusroConfig.corsProxy || 'null'}
              onChange={(e) => {
                const value = e.target.value.trim();

                updateCorsProxy(value.length === 0 ? null : value);
              }}
              className={classes.textField}
              margin="normal"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              className={classes.deleteButton}
              aria-label="Delete"
              onClick={() => updateCorsProxy(null)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Grid>
        </Grid>
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <FormLabel>Authentication</FormLabel>
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={11}>
            <TextField
              label="GitHub token"
              value={ckusroConfig.authentication.github || ''}
              placeholder={ckusroConfig.authentication.github || 'null'}
              onChange={(e) => {
                const value = e.target.value.trim();

                updateAuthenticationGithub(value.length === 0 ? null : value);
              }}
              className={classes.textField}
              margin="normal"
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              className={classes.deleteButton}
              aria-label="Delete"
              onClick={() => updateAuthenticationGithub(null)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Grid>
        </Grid>
      </FormGroup>
    </>
  );
}

export default function() {
  const state = useSelector((state: State) => ({
    ckusroConfig: state.config,
  }));
  const dispatch = useDispatch();
  const classes = useConfigViewStyles();
  const dispatchProps = {
    updateCorsProxy: (value: string | null) =>
      dispatch(updateCorsProxyAction(value)),
    updateAuthenticationGithub: (value: string | null) =>
      dispatch(updateAuthenticationGithubAction(value)),
  };

  return (
    <ConfigView
      ckusroConfig={state.ckusroConfig}
      {...dispatchProps}
      classes={classes}
    />
  );
}
