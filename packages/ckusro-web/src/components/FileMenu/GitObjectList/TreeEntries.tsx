import {
  TreeObject,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { List } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../models/ObjectManager';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import TreeEntry from './TreeEntry';
import useGitObjectListStyles from './useGitObjectListStyles';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type StateProps = {
  gitObject: TreeObject;
};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
};

export type TreeEntriesProps = OwnProps & StateProps & StyleProps;

export function TreeEntries({
  gitObject,
  internalPath,
  classes,
}: TreeEntriesProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry
      key={item.oid + item.path}
      treeEntry={item}
      internalPath={createInternalPath(internalPath).join(item.path)}
    />
  ));

  return (
    <List className={classes.list} subheader={<li />}>
      {entries}
    </List>
  );
}

const Memoized = React.memo(TreeEntries, (prev, next) => prev.oid === next.oid);

export default function(props: OwnProps) {
  const { oid, internalPath } = props;
  const classes = useGitObjectListStyles();
  const { objectManager } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.repositories.objectManager),
  }));
  if (oid == null || internalPath == null) {
    return null;
  }

  const gitObject = objectManager.fetch(oid, 'tree');
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  const state = {
    gitObject,
  };

  return <Memoized {...props} {...state} classes={classes} />;
}
