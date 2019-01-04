import { join } from 'path';
import React, { ReactNode } from 'react';
import { LoaderContext } from '../../../../loader';
import { CkusroFile } from '../../../../models/ckusroFile';

export type Props = {
  file: CkusroFile;
  context: LoaderContext;
  children?: ReactNode;
};

export default function TreeViewItem({ context, file, children }: Props) {
  return (
    <li>
      <div>
        <a href={join(context.path, file.path)}>{file.name}</a>
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
