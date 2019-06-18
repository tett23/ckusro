import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObjects } from '../modules/thunkActions';

type OwnProps = {
  oids: string[] | null;
  children?: ReactNode;
};

export type FetchObjectsProps = OwnProps;

export default function FetchObjects({ oids, children }: FetchObjectsProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (oids == null || oids.length === 0) {
      return;
    }

    dispatch(fetchObjects(oids));
  }, [(oids || []).join()]);

  return <>{children}</>;
}
