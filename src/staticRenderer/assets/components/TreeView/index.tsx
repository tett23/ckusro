import React from 'react';
import { CkusroFile } from '../../../../loader';
import buildNamespaceTree, { TreeViewItem } from './buildTree';
import TreeViewItemComponent from './TreeViewItem';

export type Props = {
  files: CkusroFile[];
  currentId: string;
};

type Table = { [key in string]: CkusroFile };

export default function TreeView({ files, currentId }: Props) {
  const currentFile = files.find((item) => currentId === item.id);
  if (currentFile == null) {
    throw new Error(`CkusroFile not found. id=${currentId}`);
  }

  const tv = buildNamespaceTree(files);
  const table = files.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Table,
  );
  const items = tv.map((tvi) => gen(table, tvi));

  return <ul>{items}</ul>;
}

function gen(table: Table, tvi: TreeViewItem) {
  const file = table[tvi.id];
  if (file == null) {
    throw new Error('');
  }

  return (
    <TreeViewItemComponent key={file.id} file={file}>
      {tvi.children.map((item) => gen(table, item))}
    </TreeViewItemComponent>
  );
}
