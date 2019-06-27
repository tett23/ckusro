import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { TreeEntry } from './TreeEntry';
import { Box } from '@material-ui/core';

export type TreeObjectProps = {
  gitObject: TreeObjectType;
};

export default function TreeObject({ gitObject }: TreeObjectProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid + item.path} treeEntry={item} />
  ));

  return <Box>{entries}</Box>;
}
