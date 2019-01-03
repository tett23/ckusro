import React, { ReactNode } from 'react';
import { CkusroFile } from '../../../../loader';

export type Props = {
  file: CkusroFile;
  children?: ReactNode;
};

export default function TreeViewItem({ file, children }: Props) {
  return (
    <li>
      <div>{file.name}</div>
      <Children items={children} />
    </li>
  );
}

function Children({ items }: { items: ReactNode }) {
  if (items == null) {
    return null;
  }

  return <ul>items</ul>;
}
