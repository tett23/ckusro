import { TagObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../ObjectLink';

export type TagObjectProps = {
  gitObject: TagObject;
};

export default function TagObject({ gitObject }: TagObjectProps) {
  return (
    <View>
      <Text>oid: {gitObject.oid}</Text>
      <Text>type: {gitObject.type}</Text>
      <Text>
        {gitObject.content.tagger.name}
        {'<'}
        {gitObject.content.tagger.email}
        {'>'}
        {gitObject.content.tagger.timestamp}
      </Text>
      <Text>tag: {gitObject.content.tag}</Text>
      <Text>
        object:
        <ObjectLink oid={gitObject.content.object}>
          {gitObject.content.object}
        </ObjectLink>
      </Text>
      <Text>message: {gitObject.content.message}</Text>
    </View>
  );
}
