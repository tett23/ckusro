import React from 'react';
import InternalPathNavigation from './InternalPathNavigation';
import { InternalPath } from '@ckusro/ckusro-core';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';

type OwnProps = {
  internalPath: InternalPath | null;
};

export type NavigationProps = OwnProps;

export function Navigation({ internalPath }: NavigationProps) {
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
    internalPath: state.ui.misc.currentInternalPath,
  }));

  return <Navigation {...state} />;
}
