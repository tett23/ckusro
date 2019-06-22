import { TreeObject } from '@ckusro/ckusro-core';
import { List } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../models/ObjectManager';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import TreeEntry from './TreeEntry';

type OwnProps = {
  oid: string;
  gitObject: TreeObject;
};

export type TreeEntriesProps = OwnProps;

export function TreeEntries({ gitObject }: TreeEntriesProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));

  return <List subheader={<li />}>{entries}</List>;
}

const Memoized = React.memo(TreeEntries, (prev, next) => prev.oid === next.oid);

export default function() {
  const { objectManager, currentOid } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.objectManager),
    currentOid: state.gitObjectList.currentOid,
  }));
  if (currentOid == null) {
    return null;
  }

  const gitObject = objectManager.fetch<TreeObject>(currentOid);
  if (gitObject == null) {
    return <FetchObjects oids={[currentOid]} />;
  }

  return <Memoized oid={currentOid} gitObject={gitObject} />;
}
