import React from 'react';
import { BufferInfo } from '@ckusro/ckusro-core';
import { TreeBufferPanel } from './TreeBufferPanel';
import BlobBufferPanel from './BlobBufferPanel';

export type BufferInfoPanelProps = {
  bufferInfo: BufferInfo;
};

export default function BufferInfoPanel({ bufferInfo }: BufferInfoPanelProps) {
  switch (bufferInfo.type) {
    case 'commit':
      return null;
    case 'tree':
      return <TreeBufferPanel bufferInfo={bufferInfo} />;
    case 'blob':
      return <BlobBufferPanel bufferInfo={bufferInfo} />;
    case 'tag':
      return null;
    default:
      return null;
  }
}
