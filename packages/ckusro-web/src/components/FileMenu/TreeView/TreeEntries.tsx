import {
  TreeEntry as TreeEntryType,
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
import useTreeViewStyles from './useTreeViewStyles';
import { createRepositoriesManager } from '../../../models/RepositoriesManager';

type OwnProps = {
  internalPath: InternalPath;
  oid: string;
};

type StateProps = {
  internalPath: InternalPath;
  treeEntries: TreeEntryType[];
};

export type TreeEntriesProps = StateProps;

export function TreeEntries({ treeEntries, internalPath }: TreeEntriesProps) {
  const entries = treeEntries.map((item) => (
    <TreeEntry
      key={item.oid + item.path}
      internalPath={createInternalPath(internalPath).join(item.path)}
      treeEntry={item}
    />
  ));
  const styles = useTreeViewStyles();

  return (
    <List
      dense={true}
      component="div"
      disablePadding
      className={styles.listStyle}
    >
      {entries}
    </List>
  );
}

export default function({ oid, internalPath }: OwnProps) {
  const { gitObject, treeEntries } = useSelector((state: State) => ({
    gitObject: createObjectManager(
      state.domain.repositories.objectManager,
    ).fetch(oid, 'tree'),
    treeEntries: createRepositoriesManager(
      state.domain.repositories,
    ).fetchCurrentTreeEntries(internalPath),
  }));
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  const stateProps: StateProps = {
    internalPath,
    treeEntries,
  };

  return (
    <FetchObjects oids={treeEntries.map(({ oid }) => oid)}>
      <TreeEntries {...stateProps} />
    </FetchObjects>
  );
}
