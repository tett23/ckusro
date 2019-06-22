import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../../models/ObjectManager';
import { State } from '../../../../modules';
import FetchObjects from '../../../FetchObject';
import TreeEntry from '../../TreeEntry';
import useGitObjectListStyles from '../../useGitObjectListStyles';
import TreeName from './TreeName';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  treeObject: TreeObjectType;
};

type StyleProps = {
  listSectionClass: string;
  ulClass: string;
};

export type TreeObjectProps = OwnProps & StateProps & StyleProps;

export function TreeObject({
  treeObject,
  oid,
  path,
  listSectionClass,
  ulClass,
}: TreeObjectProps) {
  if (treeObject == null) {
    return null;
  }

  const entries = treeObject.content.map((item) => (
    <TreeEntry key={item.oid + item.path} treeEntry={item} />
  ));

  return (
    <li className={listSectionClass}>
      <ul className={ulClass}>
        <TreeName oid={oid} name={path} />
        {entries}
      </ul>
    </li>
  );
}

const Memoized = React.memo(TreeObject, (prev, next) => prev.oid === next.oid);

export default function(ownProps: OwnProps) {
  const styles = useGitObjectListStyles();
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
      <Memoized {...ownProps} treeObject={gitObject} {...styles} />
    </FetchObjects>
  );
}
