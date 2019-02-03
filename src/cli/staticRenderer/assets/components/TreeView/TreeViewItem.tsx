import { join } from 'path';
import React, { ReactNode } from 'react';
import {
  FileBuffer,
  fileBufferName,
  replaceExt,
} from '../../../../../models/FileBuffer';
import { OutputContext } from '../../../../../models/OutputContext';

export type Props = {
  file: FileBuffer;
  context: OutputContext;
  children?: ReactNode;
};

export default function TreeViewItem({ context, file, children }: Props) {
  return (
    <li>
      <div>
        <a href={join(context.path, replaceExt(file))}>
          {fileBufferName(file)}
        </a>
      </div>
      <Children items={children} />
    </li>
  );
}

function Children({ items }: { items: ReactNode }) {
  if (items == null) {
    return null;
  }

  return <ul>{items}</ul>;
}
