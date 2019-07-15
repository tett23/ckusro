import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import {
  isBlobEntry,
  InternalPathBlobEntry,
  createInternalPath,
} from '@ckusro/ckusro-core';
import StageEntry from './StageEntry';
import { List, ListSubheader } from '@material-ui/core';
import { createStageManager } from '../../../models/StageEntryManager';

type StateProps = {
  oid: string;
  pathEntries: InternalPathBlobEntry[];
};

export type StageProps = StateProps;

export function Stage({ pathEntries: stageEntries }: StageProps) {
  const items = stageEntries.map(([internalPath, blobEntry]) => (
    <StageEntry
      key={`${createInternalPath(internalPath).flat()}-${blobEntry.oid}`}
      internalPath={internalPath}
      blobEntry={blobEntry}
    />
  ));

  return (
    <>
      <ListSubheader>Stage</ListSubheader>
      <List>{items}</List>
    </>
  );
}

const Memoized = React.memo(Stage, (prev, next) => prev.oid === next.oid);

export default function() {
  const { stageHead, stageEntries } = useSelector(
    ({ domain: { stageManager } }: State) => ({
      stageHead: stageManager.headOid,
      stageEntries: createStageManager(stageManager)
        .pathEntries()
        .filter((item): item is InternalPathBlobEntry => isBlobEntry(item[1])),
    }),
  );
  if (stageHead == null) {
    return null;
  }

  return <Memoized oid={stageHead} pathEntries={stageEntries} />;
}
