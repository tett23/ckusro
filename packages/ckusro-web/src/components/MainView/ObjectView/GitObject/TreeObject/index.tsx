import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { TreeEntry } from './TreeEntry';
import { Box } from '@material-ui/core';
import { TreeBufferInfo } from '../../../../../models/BufferInfo';

export type TreeObjectProps = {
  gitObject: TreeObjectType;
  treeBufferInfo: TreeBufferInfo;
};

export default function TreeObject({
  gitObject,
  treeBufferInfo,
}: TreeObjectProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry
      key={item.oid + item.path}
      treeEntry={item}
      treeBufferInfo={treeBufferInfo}
    />
  ));

  return <Box>{entries}</Box>;
}
