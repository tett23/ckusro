import { GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import { Text, View } from '../../shared';
import styled from '../../styled';
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
  width: auto;
  flex-basis: 65vw;
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
    default:
      return null;
  }
}

const Memoized = React.memo(
  ObjectView,
  (prev, next) => prev.gitObject === next.gitObject,
);

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
    return <FetchObjects oids={oid == null ? [] : [oid]} />;
  }

  return <Memoized gitObject={gitObject} />;
}
