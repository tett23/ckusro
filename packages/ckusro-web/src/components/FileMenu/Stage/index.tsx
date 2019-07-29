import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import { InternalPathBlobEntry, createInternalPath } from '@ckusro/ckusro-core';
import StageEntry from './StageEntry';
import { List, ListSubheader } from '@material-ui/core';
import { createPathManager } from '../../../models/PathManager';

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
    ({
      domain: {
        repositories: { stageHead, stagePathManager, repositoryPathManager },
      },
    }: State) => ({
      stageHead,
      stageEntries: createPathManager(
        createPathManager(stagePathManager).removeUnchanged(
          repositoryPathManager,
        ),
      ).filterBlob(),
    }),
  );
  if (stageHead == null) {
    return null;
  }

  return <Memoized oid={stageHead} pathEntries={stageEntries} />;
}
