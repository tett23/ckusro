import { CommitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';

export type CommitObjectProps = {
  object: CommitObject;
};

export default function CommitObject({ object }: CommitObjectProps) {
  return (
    <View>
      <Text>oid: {object.oid}</Text>
      <Text>type: {object.type}</Text>
      <Text>
        {object.content.author.name}
        {'<'}
        {object.content.author.email}
        {'>'}
        {object.content.author.timestamp}
      </Text>
      <Text>
        {object.content.committer.name}
        {'<'}
        {object.content.committer.email}
        {'>'}
        {object.content.committer.timestamp}
      </Text>
      <Text>tree: {object.content.parent}</Text>
      <Text>parent: {object.content.tree}</Text>
      <Text>message: {object.content.message}</Text>
    </View>
  );
}
