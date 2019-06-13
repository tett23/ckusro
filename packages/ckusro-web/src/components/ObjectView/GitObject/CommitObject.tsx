import { CommitObject as CommitObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../ObjectLink';

export type CommitObjectProps = {
  object: CommitObjectType;
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
      <Text>
        tree:
        <ObjectLink oid={object.content.tree}>{object.content.tree}</ObjectLink>
      </Text>
      <Text>
        parent:
        {object.content.parent.map((oid) => (
          <ObjectLink key={oid} oid={oid}>
            {oid}
          </ObjectLink>
        ))}
      </Text>
      <Text>message: {object.content.message}</Text>
    </View>
  );
}
