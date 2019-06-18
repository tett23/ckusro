import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../../models/ObjectManager';
import { State } from '../../../../modules';
import FetchObjects from '../../../FetchObject';
import TreeEntry from '../../TreeEntry';
import TreeName from './TreeName';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  treeObject: TreeObjectType;
};

export type TreeObjectProps = OwnProps & StateProps;

export function TreeObject({ treeObject, path }: TreeObjectProps) {
  if (treeObject == null) {
    return null;
  }

  const entries = treeObject.content.map((item) => (
    <TreeEntry key={item.oid + item.path} treeEntry={item} />
  ));

  return (
    <>
      <TreeName oid={treeObject.oid} name={path} />
      {entries}
    </>
  );
}

const Memoized = React.memo(TreeObject, (prev, next) => prev.oid === next.oid);

export default function(ownProps: OwnProps) {
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(
      ownProps.oid,
    ),
  );
  if (gitObject == null) {
    return <FetchObjects oids={[ownProps.oid]} />;
  }

  return (
    <FetchObjects oids={gitObject.content.map(({ oid }) => oid)}>
      <Memoized {...ownProps} treeObject={gitObject} />
    </FetchObjects>
  );
}
