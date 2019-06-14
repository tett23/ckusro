import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../modules/thunkActions';
import { fetchObject } from '../../modules/thunkActions';
import { Text } from './index';

type OwnProps = {
  oid: string | null;
  children: ReactNode;
};

type DispatchProps = {
  fetchObject: () => void;
  updateCurrentOid: () => void;
};

export type ObjectLinkTextProps = OwnProps & DispatchProps;

export function ObjectLinkText({
  oid,
  children,
  fetchObject,
  updateCurrentOid,
}: ObjectLinkTextProps) {
  useEffect(() => {
    fetchObject();
  }, [oid]);

  return <Text onPress={updateCurrentOid}>{children}</Text>;
}

export default function(ownProps: OwnProps) {
  const { oid } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    fetchObject() {
      if (oid == null) {
        return;
      }

      dispatch(fetchObject(oid));
    },
    updateCurrentOid() {
      dispatch(updateCurrentOid(oid));
    },
  };

  return <ObjectLinkText {...ownProps} {...actions} />;
}
