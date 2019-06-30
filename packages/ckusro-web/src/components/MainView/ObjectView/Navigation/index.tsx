import React from 'react';
import InternalPathNavigation from './InternalPathNavigation';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import { BufferInfo } from '../../../../models/BufferInfo';

type OwnProps = {
  bufferInfo: BufferInfo | null;
};

export type NavigationProps = OwnProps;

export function Navigation({ bufferInfo }: NavigationProps) {
  if (bufferInfo == null) {
    return null;
  }

  let internalPath = null;
  switch (bufferInfo.type) {
    case 'commit':
    case 'tag':
      internalPath = { repoPath: bufferInfo.repoPath, path: '/' };
      break;
    case 'blob':
    case 'tree':
      internalPath = bufferInfo.internalPath;
  }
  if (internalPath == null) {
    return null;
  }

  return (
    <InternalPathNavigation
      internalPath={internalPath}
    ></InternalPathNavigation>
  );
}

export default function() {
  const state = useSelector((state: State) => ({
    bufferInfo: state.ui.mainView.objectView.bufferInfo,
  }));

  return <Navigation {...state} />;
}
