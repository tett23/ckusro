import React from 'react';
import {
  FileBuffer,
  fileBufferName,
} from '../../../../../../../models/FileBuffer';

export type Props = {
  fileBuffer: FileBuffer;
};

export default function TreeViewItem({ fileBuffer }: Props) {
  return (
    <li>
      <div>{fileBufferName(fileBuffer)}</div>
    </li>
  );
}
