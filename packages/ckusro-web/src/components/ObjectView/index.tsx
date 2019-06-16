import { GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import FetchObject from '../FetchObject';
import styled from '../styled';
import BlobObject from './GitObject/BlobObject';
import CommitObject from './GitObject/CommitObject';
import TagObject from './GitObject/TagObject';
import TreeObject from './GitObject/TreeObject';

export type ObjectViewProps = {
  gitObject: GitObject | null;
};

export function ObjectView({ gitObject }: ObjectViewProps) {
  if (gitObject == null) {
    return (
      <Wrapper>
        <EmptyObjectView />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <GitObjectView gitObject={gitObject} />
    </Wrapper>
  );
}

function EmptyObjectView() {
  return <Text>EmptyObjectView</Text>;
}

const Wrapper = styled(View)`
  padding: 2rem;
  overflow-y: scroll;
`;

type GitObjectViewProps = {
  gitObject: GitObject;
};

function GitObjectView({ gitObject }: GitObjectViewProps) {
  switch (gitObject.type) {
    case 'commit':
      return <CommitObject gitObject={gitObject} />;
    case 'tree':
      return <TreeObject gitObject={gitObject} />;
    case 'blob':
      return <BlobObject gitObject={gitObject} />;
    case 'tag':
      return <TagObject gitObject={gitObject} />;
  }
}

export default function() {
  const { oid, gitObject } = useSelector(
    ({ domain: { objectManager }, objectView: { currentOid } }: State) => {
      return {
        oid: currentOid,
        gitObject: objectManager[currentOid || ''],
      };
    },
  );
  if (gitObject == null) {
    return <FetchObject oid={oid} />;
  }

  return <ObjectView gitObject={gitObject} />;
}
