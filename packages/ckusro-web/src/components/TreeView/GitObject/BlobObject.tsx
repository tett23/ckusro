import { BlobObject as BlobObjectType, GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';
import ObjectLink from '../../shared/ObjectLinkText';

export type BlobObjectProps = {
  path: string;
  blobObject: BlobObjectType;
};

export function BlobObject({ path, blobObject: { oid } }: BlobObjectProps) {
  return (
    <View>
      <ObjectLink oid={oid}>{path}</ObjectLink>
    </View>
  );
}

export default function({ path: name, oid }: { path: string; oid: string }) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[oid],
  );
  if (gitObject == null) {
    return <FetchObject oid={oid} />;
  }

  return <BlobObject path={name} blobObject={gitObject as BlobObjectType} />;
}
