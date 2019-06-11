import { TreeEntry } from '@ckusro/ckusro-core';
import React from 'react';
import { View } from 'react-native';
import FetchObject from '../../FetchObject';
import ObjectLink from '../../ObjectView/ObjectLink';
import TreeObject from '../GitObject/TreeObject';

export type TreeEntryTreeProps = {
  treeEntry: TreeEntry;
};

export default function TreeEntryTree({
  treeEntry: { oid, path },
}: TreeEntryTreeProps) {
  return (
    <View>
      <FetchObject oid={oid}>
        <ObjectLink oid={oid}>{path}</ObjectLink>
        <TreeObject oid={oid} />
      </FetchObject>
    </View>
  );
}
