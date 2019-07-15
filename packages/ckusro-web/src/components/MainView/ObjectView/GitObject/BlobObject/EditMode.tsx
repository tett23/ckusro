import React from 'react';
import { BlobBufferInfo } from '../../../../../models/BufferInfo';
import Editor from '../../../../Editor';

export type EditModeProps = {
  blobBufferInfo: BlobBufferInfo;
};

export function EditMode({ blobBufferInfo }: EditModeProps) {
  return <Editor blobBufferInfo={blobBufferInfo} />;
}
