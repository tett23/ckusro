import React from 'react';
import { BlobObject, BlobBufferInfo } from '@ckusro/ckusro-core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../modules';
import { createObjectManager } from '../../models/ObjectManager';
import FetchObjects from '../FetchObject';
import { updateBlobBuffer } from '../../modules/thunkActions';

type OwnProps = {
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  blobObject: BlobObject;
};

type DispatchProps = {
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
};

export type EditorProps = OwnProps & StateProps & DispatchProps;

export function Editor({ blobObject, onChange, onBlur }: EditorProps) {
  const content = new TextDecoder().decode(blobObject.content);

  return (
    <textarea
      value={content}
      rows={100}
      cols={100}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
    />
  );
}

export default function(props: OwnProps) {
  const { blobObject } = useSelector((state: State) => ({
    blobObject: createObjectManager(state.domain.objectManager).fetch(
      props.blobBufferInfo.oid,
      'blob',
    ),
  }));
  const dispatch = useDispatch();
  const update = (value: string) =>
    dispatch(
      updateBlobBuffer({
        type: 'blob',
        internalPath: props.blobBufferInfo.internalPath,
        content: Buffer.from(value),
      }),
    );
  const dispatchProps = {
    onChange: update,
    onBlur: update,
  };

  if (blobObject == null) {
    return <FetchObjects oids={[props.blobBufferInfo.oid]} />;
  }

  const stateProps: StateProps = {
    blobObject,
  };

  return <Editor {...props} {...stateProps} {...dispatchProps} />;
}
