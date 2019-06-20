import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createObjectManager } from '../models/ObjectManager';
import { State } from '../modules';
import { fetchObjects } from '../modules/thunkActions';

type OwnProps = {
  oids: string[] | null;
  children?: ReactNode;
};

export type FetchObjectsProps = OwnProps;

export default function FetchObjects({ oids, children }: FetchObjectsProps) {
  const manager = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (oids == null || oids.length === 0) {
      return;
    }

    const fetchOids = manager.difference(oids);
    if (fetchOids.length === 0) {
      return;
    }

    dispatch(fetchObjects(fetchOids));
  }, [(oids || []).join()]);

  return <>{children}</>;
}
