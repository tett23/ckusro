import { Paper } from '@material-ui/core';
import React from 'react';
import Header from './Header';
import useGitObjectListStyles from './useGitObjectListStyles';
import ObjectList from './ObjectList';

type OwnProps = {};

type StateProps = {};

type DispatchProps = {};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function GitObjectList({ classes }: HeaderProps) {
  return (
    <Paper className={classes.rootClass}>
      <Header />
      <ObjectList />
    </Paper>
  );
}

export default function () {
  const classes = useGitObjectListStyles();

  return <GitObjectList classes={classes} />;
}
