import { TreeEntry as TreeEntryType, TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../ObjectLink';

export type TreeObjectProps = {
  object: TreeObjectType;
};

export default function TreeObject({ object }: TreeObjectProps) {
  const entries = object.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));
  return (
    <View>
      <Text>oid: {object.oid}</Text>
      <Text>type: {object.type}</Text>
      {entries}
    </View>
  );
}

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};
function TreeEntry({ treeEntry }: TreeEntryProps) {
  return (
    <View>
      <Text>{treeEntry.path}</Text>
      <Text>
        <ObjectLink oid={treeEntry.oid}>{treeEntry.oid}</ObjectLink>
      </Text>
    </View>
  );
}
