import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import { createPathManager } from '../../../models/PathManager';
import { createObjectManager } from '../../../models/ObjectManager';
import FetchObjects from '../../FetchObject';
import { InternalPath, BlobObject } from '@ckusro/ckusro-core';
import { Diff } from '../../Diff';

type StateProps = {
  internalPath: InternalPath;
  original: BlobObject;
  stage: BlobObject;
};

export type DiffViewProps = StateProps;

export function DiffView({ internalPath, original, stage }: DiffViewProps) {
  const a = new TextDecoder().decode(original.content);
  const b = new TextDecoder().decode(stage.content);

  return <Diff name={internalPath.path} a={a} b={b} />;
}

export default function() {
  const state = useSelector((state: State) => {
    const bufferInfo = state.ui.mainView.objectView.bufferInfo;
    if (bufferInfo == null || bufferInfo.type != 'blob') {
      return null;
    }

    const original = createPathManager(
      state.domain.repositories.repositoryPathManager,
    ).fetch(bufferInfo.internalPath);
    const stage = createPathManager(
      state.domain.repositories.stagePathCache,
    ).fetch(bufferInfo.internalPath);
    if (original == null || stage == null) {
      return null;
    }

    const objectManager = createObjectManager(
      state.domain.repositories.objectManager,
    );

    return {
      internalPath: bufferInfo.internalPath,
      originalOid: original.oid,
      stageOid: stage.oid,
      objectManager,
    };
  });
  if (state == null) {
    return null;
  }

  const { internalPath, objectManager, originalOid, stageOid } = state;
  const original = objectManager.fetch(originalOid, 'blob');
  const stage = objectManager.fetch(stageOid, 'blob');

  if (original == null || stage == null) {
    return <FetchObjects oids={[originalOid, stageOid]} />;
  }

  const stateProps: StateProps = {
    internalPath,
    original,
    stage,
  };

  return <DiffView {...stateProps} />;
}
