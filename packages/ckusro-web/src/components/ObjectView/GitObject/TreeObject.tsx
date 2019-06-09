import { TreeEntry, TreeObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';

export type TreeObjectProps = {
  object: TreeObject;
};

export default function TreeObject({ object }: TreeObjectProps) {
  const entries = object.content.map((item) => <TreeEntry treeEntry={item} />);
  return (
    <View>
      <Text>oid: {object.oid}</Text>
      <Text>type: {object.type}</Text>
      {entries}
    </View>
  );
}

export type TreeEntryProps = {
  treeEntry: TreeEntry;
};
function TreeEntry({ treeEntry }: TreeEntryProps) {
  return (
    <View>
      <Text>{treeEntry.path}</Text>
      <Text>{treeEntry.oid}</Text>
    </View>
  );
}
