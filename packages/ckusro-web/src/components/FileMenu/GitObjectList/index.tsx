import { Paper } from '@material-ui/core';
import React from 'react';
import Header from './Header';
import TreeEntries from './TreeEntries';
import useGitObjectListStyles from './useGitObjectListStyles';
import { State } from '../../../modules';
import { useSelector } from 'react-redux';
import FetchObjects from '../../FetchObject';
import { createObjectManager } from '../../../models/ObjectManager';
import { TreeObject, InternalPath } from '@ckusro/ckusro-core';

type OwnProps = {};

type StateProps = {
  oid: string;
  internalPath: InternalPath;
};

type DispatchProps = {};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function GitObjectList({ oid, internalPath, classes }: HeaderProps) {
  return (
    <Paper className={classes.rootClass}>
      <Header />
      <TreeEntries oid={oid} internalPath={internalPath} />
    </Paper>
  );
}

export default function() {
  const classes = useGitObjectListStyles();
  const { objectManager, internalPath, oid } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.objectManager),
    internalPath: state.ui.misc.currentInternalPath,
    oid: state.objectView.currentOid,
  }));
  if (internalPath == null || oid == null) {
    return null;
  }

  const gitObject = objectManager.fetch<TreeObject>(oid);
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  const state = {
    oid,
    internalPath,
  };

  return <GitObjectList {...state} classes={classes} />;
}
