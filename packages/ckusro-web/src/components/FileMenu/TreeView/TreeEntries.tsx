import {
  TreeEntry as TreeEntryType,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { List } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import TreeEntry from './TreeEntry';
import useTreeViewStyles from './useTreeViewStyles';
import { createRepositoriesManager } from '../../../models/RepositoriesManager';

type OwnProps = {
  internalPath: InternalPath;
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

export default function({ internalPath }: OwnProps) {
  const { treeEntries } = useSelector((state: State) => ({
    treeEntries: createRepositoriesManager(
      state.domain.repositories,
    ).fetchCurrentTreeEntries(internalPath),
  }));

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
