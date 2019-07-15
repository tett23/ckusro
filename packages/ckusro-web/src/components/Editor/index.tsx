import React, { useMemo, useState, useEffect } from 'react';
import { BlobObject, BlobBufferInfo, InternalPath } from '@ckusro/ckusro-core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../modules';
import { createObjectManager } from '../../models/ObjectManager';
import FetchObjects from '../FetchObject';
import { updateBlobBuffer } from '../../modules/thunkActions';
import debounce from 'lodash.debounce';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  blobObject: BlobObject;
  content: string | null;
};

type DispatchProps = {
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
};

export type EditorProps = OwnProps & StateProps & DispatchProps;

export function Editor({ content, onChange, onBlur }: EditorProps) {
  if (content == null) {
    return null;
  }

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
  const [content, setContent] = useState<string | null>(null);
  const { internalPath, oid } = props.blobBufferInfo;
  useEffect(() => {
    setContent(
      new TextDecoder().decode(
        (blobObject || { content: Buffer.from('') }).content,
      ),
    );

    return () => {
      if (content == null) {
        return;
      }

      onChange(content);
    };
  }, [oid]);
  const dispatch = useDispatch();
  const updateBuffer = buildUpdateBlobBuffer(dispatch, internalPath);
  const debounced = useMemo(() => debounce(updateBuffer, 5000), [oid]);
  const onChange = (value: string) => {
    setContent(value);
    debounced(value);
  };
  const dispatchProps = {
    onChange: onChange,
    onBlur: updateBuffer,
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

function buildUpdateBlobBuffer(
  dispatch: ThunkDispatch<State, unknown, Action>,
  internalPath: InternalPath,
) {
  return (content: string) =>
    dispatch(
      updateBlobBuffer({
        type: 'blob',
        internalPath,
        content: Buffer.from(content),
      }),
    );
}
