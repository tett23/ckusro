import React from 'react';
import { CkusroFile } from '../../../../models/CkusroFile';
import { OutputContext } from '../../../../models/OutputContext';
import buildNamespaceTree, {
  TreeViewItem as TreeViewItemModel,
} from './buildTree';
import TreeViewItem from './TreeViewItem';

export type Props = {
  contexts: OutputContext[];
  files: CkusroFile[];
};

type Table = { [key in string]: CkusroFile };

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
      throw new Error(`Context not found. name=${table[tvi.id].name}`);
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
