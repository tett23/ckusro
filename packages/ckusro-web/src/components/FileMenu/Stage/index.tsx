import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import { isBlobEntry, BlobPathTreeEntry } from '@ckusro/ckusro-core';
import StageEntry from './StageEntry';
import { List } from '@material-ui/core';

type StateProps = {
  oid: string;
  pathEntries: BlobPathTreeEntry[];
};

export type StageProps = StateProps;

export function Stage({ pathEntries: stageEntries }: StageProps) {
  const items = stageEntries.map(([path, blobEntry]) => (
    <StageEntry
      key={`${path}-${blobEntry.oid}`}
      path={path}
      blobEntry={blobEntry}
    />
  ));

  return <List>{items}</List>;
}

const Memoized = React.memo(Stage, (prev, next) => prev.oid === next.oid);

export default function() {
  const { stageHead, stageEntries } = useSelector((state: State) => ({
    stageHead: state.domain.stageHead,
    stageEntries: state.domain.stageEntries.filter(
      (item): item is BlobPathTreeEntry => isBlobEntry(item[1]),
    ),
  }));
  if (stageHead == null) {
    return null;
  }

  return <Memoized oid={stageHead} pathEntries={stageEntries} />;
}
