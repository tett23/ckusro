import { GitObject, TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import FetchObject from '../../../FetchObject';
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

export default function(ownProps: OwnProps) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[ownProps.oid],
  );
  if (gitObject == null) {
    return <FetchObject oid={ownProps.oid} />;
  }

  return <TreeObject {...ownProps} treeObject={gitObject as TreeObjectType} />;
}
