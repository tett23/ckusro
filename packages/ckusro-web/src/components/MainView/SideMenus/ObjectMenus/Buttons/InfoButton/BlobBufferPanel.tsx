import React from 'react';
import { CardContent, Divider } from '@material-ui/core';
import { BlobBufferInfo, BlobObject, InternalPath } from '@ckusro/ckusro-core';
import { useSelector } from 'react-redux';
import { State } from '../../../../../../modules';
import { createObjectManager } from '../../../../../../models/ObjectManager';
import { createRepositoriesManager } from '../../../../../../models/RepositoriesManager';
import { MergedPathManagerItem } from '../../../../../../models/FilesStatus';
import useBufferInfoPopperStyles from './useBufferInfoPopperStyles';
import FilenameAndShortOid from './FilenameAndShortOid';
import EntryStatus from './EntryStatus';
import CharacterCount from './TextStat';

type OwnProps = {
  bufferInfo: BlobBufferInfo;
};

type StateProps = {
  internalPath: InternalPath;
  blobObject: BlobObject;
  entryStatus: MergedPathManagerItem;
};

type StyleProps = {
  classes: ReturnType<typeof useBufferInfoPopperStyles>;
};

export type BlobBufferPanelProps = StateProps & StyleProps;

export function BlobBufferPanel({
  internalPath,
  blobObject,
  entryStatus,
  classes,
}: BlobBufferPanelProps) {
  return (
    <>
      <CardContent>
        <FilenameAndShortOid internalPath={internalPath} oid={blobObject.oid} />
        <Divider variant="middle" className={classes.divider} />
        <EntryStatus entryStatus={entryStatus} />
        <CharacterCount entryStatus={entryStatus} />
      </CardContent>
    </>
  );
}

export default function(ownProps: OwnProps) {
  const props = buildBlobBufferInfoProps(ownProps);
  if (props == null) {
    return null;
  }

  return <BlobBufferPanel {...props} />;
}

export function buildBlobBufferInfoProps({
  bufferInfo: { oid, internalPath },
}: OwnProps): BlobBufferPanelProps | null {
  const { blobObject, entryStatus } = useSelector((state: State) => ({
    blobObject: createObjectManager(
      state.domain.repositories.objectManager,
    ).fetch(oid, 'blob'),
    entryStatus: createRepositoriesManager(
      state.domain.repositories,
    ).entryStatus(internalPath),
  }));
  const styleProps: StyleProps = {
    classes: useBufferInfoPopperStyles(),
  };

  if (blobObject == null || entryStatus == null) {
    return null;
  }

  const stateProps: StateProps = {
    internalPath,
    entryStatus,
    blobObject,
  };

  return {
    ...stateProps,
    ...styleProps,
  };
}
