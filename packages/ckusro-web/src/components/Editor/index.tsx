import React, { useMemo, useState, useEffect } from 'react';
import {
  BlobObject,
  BlobBufferInfo,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../modules';
import { createObjectManager } from '../../models/ObjectManager';
import FetchObjects from '../FetchObject';
import { updateBlobBuffer } from '../../modules/thunkActions';
import debounce from 'lodash.debounce';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import useEditorStyles from './useEditorStyles';
import { PWorkers } from '../../Workers';

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

type StyleProps = {
  classes: ReturnType<typeof useEditorStyles>;
};

export type EditorProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function Editor({ content, onChange, onBlur, classes }: EditorProps) {
  return (
    <textarea
      className={classes.editor}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
    />
  );
}

export default function(props: OwnProps) {
  const { blobObject } = useSelector((state: State) => ({
    blobObject: createObjectManager(
      state.domain.repositories.objectManager,
    ).fetch(props.blobBufferInfo.oid, 'blob'),
  }));
  const text = new TextDecoder().decode(
    (blobObject || { content: Buffer.from('') }).content,
  );
  const [content, setContent] = useState(text);
  const { internalPath, oid } = props.blobBufferInfo;
  const fullPath = createInternalPath(internalPath).flat();
  const dispatch = useDispatch();
  const updateBuffer = buildUpdateBlobBuffer(dispatch, internalPath);
  useEffect(() => {
    setContent(text);
  }, [oid, fullPath]);
  const debounced = useMemo(() => debounce(updateBuffer, 5000), [
    oid,
    fullPath,
  ]);
  const onChange = (value: string) => {
    setContent(value);
    debounced(value);
  };
  const dispatchProps = {
    onChange: onChange,
    onBlur: updateBuffer,
  };
  const styleProps = {
    classes: useEditorStyles(),
  };

  if (blobObject == null) {
    return <FetchObjects oids={[props.blobBufferInfo.oid]} />;
  }

  const stateProps: StateProps = {
    blobObject,
    content: content,
  };

  return (
    <Editor {...props} {...stateProps} {...dispatchProps} {...styleProps} />
  );
}

function buildUpdateBlobBuffer(
  dispatch: ThunkDispatch<State, PWorkers, Action>,
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
