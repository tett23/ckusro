import { Paper } from '@material-ui/core';
import React from 'react';
import Header from './Header';
import TreeEntries from './TreeEntries';
import useGitObjectListStyles from './useGitObjectListStyles';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function GitObjectList({ classes }: StyleProps) {
  return (
    <Paper className={classes.rootClass}>
      <Header />
      <TreeEntries />
    </Paper>
  );
}

export default function() {
  const classes = useGitObjectListStyles();

  return <GitObjectList classes={classes} />;
}
