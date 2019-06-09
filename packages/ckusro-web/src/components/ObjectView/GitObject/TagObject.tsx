import { TagObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';

export type TagObjectProps = {
  object: TagObject;
};

export default function TagObject({ object }: TagObjectProps) {
  return (
    <View>
      <Text>oid: {object.oid}</Text>
      <Text>type: {object.type}</Text>
      <Text>
        {object.content.tagger.name}
        {'<'}
        {object.content.tagger.email}
        {'>'}
        {object.content.tagger.timestamp}
      </Text>
      <Text>tag: {object.content.tag}</Text>
      <Text>object: {object.content.object}</Text>
      <Text>message: {object.content.message}</Text>
    </View>
  );
}
