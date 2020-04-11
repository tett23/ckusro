import React from 'react';
import RepoPathNavigation from './RepoPathNavigation';
import FileNavigation from './FileNavigation';
import { InternalPath } from '@ckusro/ckusro-core';
import { Paper, makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(1, 2),
    },
  }),
);

type OwnProps = {
  internalPath: InternalPath;
};

type StyleProps = {
  classes: ReturnType<typeof useStyles>;
};

export type InternalPathNavigationProps = OwnProps & StyleProps;

export function InternalPathNavigation({
  internalPath,
  classes,
}: InternalPathNavigationProps) {
  return (
    <>
      <Paper className={classes.root}>
        <RepoPathNavigation internalPath={internalPath} />
        <FileNavigation internalPath={internalPath} />
      </Paper>
    </>
  );
}

export default function (props: OwnProps) {
  const classes = useStyles();

  return <InternalPathNavigation {...props} classes={classes} />;
}
