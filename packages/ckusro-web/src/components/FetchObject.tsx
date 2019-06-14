import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObject } from '../modules/thunkActions';

type OwnProps = {
  oid: string | null;
  children: ReactNode;
};

export type FetchObjectProps = OwnProps;

export default function FetchObject({ oid, children }: FetchObjectProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (oid == null) {
      return;
    }

    dispatch(fetchObject(oid));
  }, [oid]);

  return <>{children}</>;
}
