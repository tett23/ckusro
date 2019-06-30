import React from 'react';
import TreeEntries from '../TreeEntries';
import { State } from '../../../../modules';
import { useSelector } from 'react-redux';
import FetchObjects from '../../../FetchObject';
import { createObjectManager } from '../../../../models/ObjectManager';
import { TreeBufferInfo } from '../../../../models/BufferInfo';

type OwnProps = {};

type StateProps = {
  bufferInfo: TreeBufferInfo;
};

type DispatchProps = {};

type StyleProps = {};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function ObjectList({ bufferInfo }: HeaderProps) {
  if (bufferInfo == null) {
    return null;
  }

  return (
    <TreeEntries oid={bufferInfo.oid} internalPath={bufferInfo.internalPath} />
  );
}

export default function() {
  const { objectManager, bufferInfo } = useSelector((state: State) => ({
    objectManager: createObjectManager(state.domain.objectManager),
    bufferInfo: state.ui.fileMenu.gitObjectList.bufferInfo,
  }));
  if (bufferInfo == null || bufferInfo.type !== 'tree') {
    return null;
  }

  const gitObject = objectManager.fetch(bufferInfo.oid, 'tree');
  if (gitObject == null) {
    return <FetchObjects oids={[bufferInfo.oid]} />;
  }

  const state = {
    bufferInfo,
  };

  return <ObjectList {...state} />;
}
