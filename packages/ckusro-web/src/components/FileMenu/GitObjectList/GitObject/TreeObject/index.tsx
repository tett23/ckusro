import {
  TreeObject as TreeObjectType,
  InternalPath,
} from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager } from '../../../../../models/ObjectManager';
import { State } from '../../../../../modules';
import FetchObjects from '../../../../FetchObject';
import useGitObjectListStyles from '../../useGitObjectListStyles';
import TreeName from './TreeName';
import TreeEntries from '../../TreeEntries';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
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
  internalPath,
  listSectionClass,
  ulClass,
}: TreeObjectProps) {
  if (treeObject == null) {
    return null;
  }

  return (
    <li className={listSectionClass}>
      <ul className={ulClass}>
        <TreeName oid={oid} internalPath={internalPath} />
        <TreeEntries oid={oid} internalPath={internalPath} />
      </ul>
    </li>
  );
}

const Memoized = React.memo(TreeObject, (prev, next) => prev.oid === next.oid);

export default function(ownProps: OwnProps) {
  const styles = useGitObjectListStyles();
  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.repositories.objectManager).fetch(
      ownProps.oid,
      'tree',
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
