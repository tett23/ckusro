import {
  TreeEntry as TreeEntryType,
  TreeObject as TreeObjectType,
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

export type TreeEntriesProps = {
  internalPath: InternalPath;
  treeEntries: TreeEntryType[];
};

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

export default function({
  oid,
  internalPath,
}: {
  internalPath: InternalPath;
  oid: string;
}) {
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(oid),
  );
  if (gitObject == null) {
    return <FetchObjects oids={oid == null ? [] : [oid]} />;
  }

  return (
    <FetchObjects oids={gitObject.content.map(({ oid }) => oid)}>
      <TreeEntries
        internalPath={internalPath}
        treeEntries={gitObject.content}
      />
    </FetchObjects>
  );
}
