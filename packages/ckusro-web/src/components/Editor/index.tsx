import React, { ReactNode } from 'react';
import { BlobBufferInfo } from '../../models/BufferInfo';
import { BlobObject } from '@ckusro/ckusro-core';

type OwnProps = {
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  blobObject: BlobObject;
};

export type EditorProps = OwnProps & StateProps;

export function Editor() {}

export default function() {}
