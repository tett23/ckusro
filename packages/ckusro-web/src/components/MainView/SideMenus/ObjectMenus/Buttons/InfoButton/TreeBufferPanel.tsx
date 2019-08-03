import React from 'react';
import { Typography } from '@material-ui/core';
import { TreeBufferInfo } from '../../../../../../models/BufferInfo';
export function TreeBufferPanel({ bufferInfo }: TreeBufferPanelProps) {
  return (
    <>
      <Typography>{bufferInfo.oid}</Typography>
      <Typography>{bufferInfo.internalPath}</Typography>
    </>
  );
}
type TreeBufferPanelProps = {
  bufferInfo: TreeBufferInfo;
};
