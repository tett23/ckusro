import React from 'react';
import {
  FileBuffer,
  fileBufferName,
} from '../../../../../../models/FileBuffer';
import { OutputContext } from '../../../../../../models/OutputContext';
import buildNamespaceTree, {
  TreeViewItem as TreeViewItemModel,
} from './buildTree';
import TreeViewItem from './TreeViewItem';

export type Props = {
  contexts: OutputContext[];
  files: FileBuffer[];
};

type Table = { [key in string]: FileBuffer };

export default function TreeView({ contexts, files }: Props) {
  const tv = buildNamespaceTree(files);
  const table = files.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Table,
  );
  const items = tv.map((tvi) => {
    const context = contexts.find(
      (item) => item.name === table[tvi.id].namespace,
    );
    if (context == null) {
      throw new Error(
        `Context not found. name=${fileBufferName(table[tvi.id])}`,
      );
    }

    return gen(table, context, tvi);
  });

  return <ul>{items}</ul>;
}

function gen(table: Table, context: OutputContext, tvi: TreeViewItemModel) {
  const file = table[tvi.id];
  if (file == null) {
    throw new Error('');
  }

  return (
    <TreeViewItem key={file.id} context={context} file={file}>
      {tvi.children.map((item) => gen(table, context, item))}
    </TreeViewItem>
  );
}
