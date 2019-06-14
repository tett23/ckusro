import {
  TreeEntry as TreeEntryType,
  TreeObject as TreeObjectType,
} from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../../shared/ObjectLinkText';

export type TreeObjectProps = {
  gitObject: TreeObjectType;
};

export default function TreeObject({ gitObject }: TreeObjectProps) {
  const entries = gitObject.content.map((item) => (
    <TreeEntry key={item.oid} treeEntry={item} />
  ));
  return (
    <View>
      <Text>oid: {gitObject.oid}</Text>
      <Text>type: {gitObject.type}</Text>
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
