import { TreeEntry } from '@ckusro/ckusro-core';
import React from 'react';
import { View } from 'react-native';
import ObjectLink from '../../shared/ObjectLinkText';

export type TreeEntryBlobProps = {
  treeEntry: TreeEntry;
};

export default function TreeEntryBlob({ treeEntry }: TreeEntryBlobProps) {
  return (
    <View>
      <ObjectLink oid={treeEntry.oid}>{treeEntry.path}</ObjectLink>
    </View>
  );
}
