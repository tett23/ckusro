import { CommitObject as CommitObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../../shared/ObjectLinkText';

export type CommitObjectProps = {
  gitObject: CommitObjectType;
};

export default function CommitObject({ gitObject }: CommitObjectProps) {
  return (
    <View>
      <Text>oid: {gitObject.oid}</Text>
      <Text>type: {gitObject.type}</Text>
      <Text>
        {gitObject.content.author.name}
        {'<'}
        {gitObject.content.author.email}
        {'>'}
        {gitObject.content.author.timestamp}
      </Text>
      <Text>
        {gitObject.content.committer.name}
        {'<'}
        {gitObject.content.committer.email}
        {'>'}
        {gitObject.content.committer.timestamp}
      </Text>
      <Text>
        tree:
        <ObjectLink oid={gitObject.content.tree}>
          {gitObject.content.tree}
        </ObjectLink>
      </Text>
      <Text>
        parent:
        {gitObject.content.parent.map((oid) => (
          <ObjectLink key={oid} oid={oid}>
            {oid}
          </ObjectLink>
        ))}
      </Text>
      <Text>message: {gitObject.content.message}</Text>
    </View>
  );
}
