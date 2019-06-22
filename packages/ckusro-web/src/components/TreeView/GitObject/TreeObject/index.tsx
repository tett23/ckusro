import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import { Collapse } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createObjectManager } from '../../../../models/ObjectManager';
import { State } from '../../../../modules';
import { updateCurrentOid } from '../../../../modules/thunkActions';
import FetchObjects from '../../../FetchObject';
import { TreeEntries } from '../../TreeEntries';
import TreeName from './TreeName';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  treeObject: TreeObjectType;
};

type DispatchProps = {
  onClick: () => void;
};

export type TreeObjectProps = OwnProps & StateProps & DispatchProps;

export function TreeObject({
  path,
  onClick,
  treeObject: { content },
}: TreeObjectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TreeName
        path={path}
        onClick={onClick}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TreeEntries treeEntries={!isOpen ? [] : content} />
      </Collapse>
    </>
  );
}

export default function(props: OwnProps) {
  const { oid } = props;

  const dispatch = useDispatch();
  const onClick = () => dispatch(updateCurrentOid(oid));

  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(oid),
  );
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  return <TreeObject {...props} treeObject={gitObject} onClick={onClick} />;
}
