import { BlobObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';

export type BlobObjectProps = {
  object: BlobObject;
};

export default function BlobObject({ object }: BlobObjectProps) {
  return (
    <View>
      <Text>oid: {object.oid}</Text>
      <Text>type: {object.type}</Text>
      <Text>content: {object.content}</Text>
    </View>
  );
}
