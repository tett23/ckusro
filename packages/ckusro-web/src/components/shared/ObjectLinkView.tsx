import React, { ReactNode, useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../modules/thunkActions';
import { fetchObjects } from '../../modules/thunkActions';

type OwnProps = {
  oid: string | null;
  children: ReactNode;
};

type DispatchProps = {
  fetchObject: () => void;
  updateCurrentOid: () => void;
};

export type ObjectLinkViewProps = OwnProps & DispatchProps;

export function ObjectLinkView({
  oid,
  children,
  fetchObject,
  updateCurrentOid,
}: ObjectLinkViewProps) {
  useEffect(() => {
    fetchObject();
  }, [oid]);

  return (
    <TouchableWithoutFeedback onPress={updateCurrentOid}>
      {children}
    </TouchableWithoutFeedback>
  );
}

export default function(ownProps: OwnProps) {
  const { oid } = ownProps;
  const dispatch = useDispatch();
  const actions = {
    fetchObject() {
      if (oid == null) {
        return;
      }

      dispatch(fetchObjects([oid]));
    },
    updateCurrentOid() {
      dispatch(updateCurrentOid(oid));
    },
  };

  return <ObjectLinkView {...ownProps} {...actions} />;
}
