import React from 'react';
import TreeEntries from '../TreeEntries';
import { State } from '../../../../modules';
import { useSelector } from 'react-redux';
import FetchObjects from '../../../FetchObject';
import { createObjectManager } from '../../../../models/ObjectManager';
import { InternalPath } from '@ckusro/ckusro-core';

type OwnProps = {};

type StateProps = {
  oid: string | null;
  internalPath: InternalPath | null;
};

type DispatchProps = {};

type StyleProps = {};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function ObjectList({ oid, internalPath }: HeaderProps) {
  if (oid == null || internalPath == null) {
    return null;
  }

  return <TreeEntries oid={oid} internalPath={internalPath} />;
}

export default function() {
  const { objectManager, internalPath, oid } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.objectManager),
    internalPath: state.ui.misc.currentInternalPath,
    oid: state.objectView.currentOid,
  }));

  if (oid != null) {
    const gitObject = objectManager.fetch(oid, 'tree');
    if (gitObject == null) {
      return <FetchObjects oids={[oid]} />;
    }
  }

  const state = {
    oid,
    internalPath,
  };

  return <ObjectList {...state} />;
}
