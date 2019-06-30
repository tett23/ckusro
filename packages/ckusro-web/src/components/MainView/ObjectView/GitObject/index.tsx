import { GitObject as GitObjectType } from '@ckusro/ckusro-core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../../modules';
import FetchObjects from '../../../FetchObject';
import BlobObject from './BlobObject';
import CommitObject from './CommitObject';
import TagObject from './TagObject';
import TreeObject from './TreeObject';

export type GitObjectProps = {
  gitObject: GitObjectType | null;
};

export function GitObject({ gitObject }: GitObjectProps) {
  if (gitObject == null) {
    return <EmptyObjectView />;
  }

  return <GitObjectView gitObject={gitObject} />;
}

function EmptyObjectView() {
  return <Typography>EmptyObjectView</Typography>;
}

type GitObjectViewProps = {
  gitObject: GitObjectType;
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
  GitObject,
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
