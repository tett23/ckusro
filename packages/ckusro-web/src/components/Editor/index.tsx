import React, { useMemo, useState } from 'react';
import { BlobObject, BlobBufferInfo } from '@ckusro/ckusro-core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../modules';
import { createObjectManager } from '../../models/ObjectManager';
import FetchObjects from '../FetchObject';
import { updateBlobBuffer } from '../../modules/thunkActions';
import debounce from 'lodash.debounce';

type OwnProps = {
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  blobObject: BlobObject;
  content: string;
};

type DispatchProps = {
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
};

export type EditorProps = OwnProps & StateProps & DispatchProps;

export function Editor({ content, onChange, onBlur }: EditorProps) {
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
  const [content, setContent] = useState(
    new TextDecoder().decode(
      (blobObject || { content: Buffer.from('') }).content,
    ),
  );
  const dispatch = useDispatch();
  const debounced = useMemo(
    () =>
      debounce(
        (value: string) =>
          dispatch(
            updateBlobBuffer({
              type: 'blob',
              internalPath: props.blobBufferInfo.internalPath,
              content: Buffer.from(value),
            }),
          ),
        5000,
      ),
    [],
  );
  const update = (value: string) => {
    setContent(value);
    debounced(value);
  };
  const dispatchProps = {
    onChange: update,
    onBlur: update,
  };

  if (blobObject == null) {
    return <FetchObjects oids={[props.blobBufferInfo.oid]} />;
  }

  const stateProps: StateProps = {
    blobObject,
    content: content,
  };

  return <Editor {...props} {...stateProps} {...dispatchProps} />;
}
