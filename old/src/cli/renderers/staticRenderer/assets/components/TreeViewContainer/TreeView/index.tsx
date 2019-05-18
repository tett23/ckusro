import React from 'react';
import { FileBuffer } from '../../../../../../../models/FileBuffer';
import { Leaf, TreeElement } from '../treeBuilder';
import TreeViewItem from './TreeViewItem';

export type Props = {
  nodes: TreeElement[];
  fileBuffers: FileBuffer[];
};

export default function TreeView({ nodes, fileBuffers }: Props) {
  const items = nodes.flatMap((node) => {
    const fileBuffer = fileBuffers.find((fb) => fb.id === node.id);
    if (fileBuffer == null) {
      return [];
    }

    if (isLeaf(node)) {
      return <TreeViewItem key={node.id} fileBuffer={fileBuffer} />;
    }

    return (
      <TreeView key={node.id} nodes={node.children} fileBuffers={fileBuffers} />
    );
  });

  return <ul>{items}</ul>;
}

function isLeaf(node: TreeElement): node is Leaf {
  return node.type === 'leaf';
}
