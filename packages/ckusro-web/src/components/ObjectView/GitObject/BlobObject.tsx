import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import ObjectLink from '../../shared/ObjectLinkText';

export type BlobObjectProps = {
  gitObject: BlobObjectType;
};

export default function BlobObject({ gitObject }: BlobObjectProps) {
  return (
    <View>
      <Text>
        oid: <ObjectLink oid={gitObject.oid}>{gitObject.oid}</ObjectLink>
      </Text>
      <Text>type: {gitObject.type}</Text>
      <Text>content: {new TextDecoder().decode(gitObject.content)}</Text>
    </View>
  );
}
