import { BlobObject as BlobObjectType, GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import ObjectLink from '../../shared/ObjectLinkText';
import styled from '../../styled';
import { Text, treeViewItem } from '../styles';

export type BlobObjectProps = {
  path: string;
  blobObject: BlobObjectType;
};

export function BlobObject({ path, blobObject: { oid } }: BlobObjectProps) {
  return (
    <Wrapper>
      <ObjectLink oid={oid}>
        <Text>{path}</Text>
      </ObjectLink>
    </Wrapper>
  );
}

const Wrapper = styled(Text)`
  ${treeViewItem}
`;

export default function({ path: name, oid }: { path: string; oid: string }) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[oid],
  );
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  return <BlobObject path={name} blobObject={gitObject as BlobObjectType} />;
}
