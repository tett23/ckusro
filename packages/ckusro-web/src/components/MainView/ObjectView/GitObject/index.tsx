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
import {
  BufferInfo,
  TagBufferInfo,
  CommitBufferInfo,
  TreeBufferInfo,
  BlobBufferInfo,
} from '../../../../models/BufferInfo';
import { createObjectManager } from '../../../../models/ObjectManager';

export type GitObjectProps = {
  gitObject: GitObjectType | null;
  bufferInfo: BufferInfo;
};

export function GitObject({ gitObject, bufferInfo }: GitObjectProps) {
  if (gitObject == null) {
    return <EmptyObjectView />;
  }

  return <GitObjectView gitObject={gitObject} bufferInfo={bufferInfo} />;
}

function EmptyObjectView() {
  return <Typography>EmptyObjectView</Typography>;
}

type GitObjectViewProps = {
  gitObject: GitObjectType;
  bufferInfo: BufferInfo;
};

function GitObjectView({ gitObject, bufferInfo }: GitObjectViewProps) {
  switch (gitObject.type) {
    case 'commit':
      return (
        <CommitObject
          gitObject={gitObject}
          repoPath={(bufferInfo as CommitBufferInfo).repoPath}
        />
      );
    case 'tree':
      return (
        <TreeObject
          gitObject={gitObject}
          treeBufferInfo={bufferInfo as TreeBufferInfo}
        />
      );
    case 'blob':
      return (
        <BlobObject
          gitObject={gitObject}
          blobBufferInfo={bufferInfo as BlobBufferInfo}
        />
      );
    case 'tag':
      return (
        <TagObject
          gitObject={gitObject}
          repoPath={(bufferInfo as TagBufferInfo).repoPath}
        />
      );
    default:
      return null;
  }
}

const Memoized = React.memo(
  GitObject,
  (prev, next) => prev.gitObject === next.gitObject,
);

export default function () {
  const { oid, gitObject, bufferInfo } = useSelector((state: State) => {
    const oid = (state.ui.mainView.objectView.bufferInfo || { oid: null }).oid;

    return {
      oid,
      bufferInfo: state.ui.mainView.objectView.bufferInfo,
      gitObject:
        oid == null
          ? null
          : createObjectManager(state.domain.repositories.objectManager).fetch(
              oid,
            ),
    };
  });
  if (gitObject == null || bufferInfo == null) {
    return <FetchObjects oids={oid == null ? [] : [oid]} />;
  }

  const state = {
    bufferInfo,
    gitObject,
  };

  return <Memoized {...state} />;
}
