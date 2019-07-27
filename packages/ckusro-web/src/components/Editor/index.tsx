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
import useEditorStyles from './useEditorStyles';
import { PWorkers } from '../../Workers';

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

type StyleProps = {
  classes: ReturnType<typeof useEditorStyles>;
};

export type EditorProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function Editor({ content, onChange, onBlur, classes }: EditorProps) {
  if (content == null) {
    return null;
  }

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
