import React, { useMemo, useState, useEffect } from 'react';
import {
  BlobBufferInfo,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../modules';
import { createObjectManager } from '../../models/ObjectManager';
import { updateBlobBuffer, fetchObjects } from '../../modules/thunkActions';
import debounce from 'lodash.debounce';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import useEditorStyles from './useEditorStyles';
import { PWorkers } from '../../Workers';

type OwnProps = {
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  content: string;
};

type DispatchProps = {
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useEditorStyles>;
};

export type EditorProps = StateProps & DispatchProps & StyleProps;

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

export function buildEditorProps(props: OwnProps) {
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
    dispatch(fetchObjects([props.blobBufferInfo.oid]));
    return null;
  }

  const stateProps: StateProps = {
    content,
  };

  return {
    ...stateProps,
    ...dispatchProps,
    ...styleProps,
  };
}

export default function (props: OwnProps) {
  const componentProps: EditorProps | null = buildEditorProps(props);
  if (componentProps == null) {
    return null;
  }

  return <Editor {...componentProps} />;
}

function buildUpdateBlobBuffer(
  dispatch: ThunkDispatch<State, PWorkers, Action>,
  internalPath: InternalPath,
) {
  return (content: string) => {
    dispatch(
      updateBlobBuffer({
        type: 'blob',
        internalPath,
        content: Buffer.from(content),
      }),
    );
  };
}
