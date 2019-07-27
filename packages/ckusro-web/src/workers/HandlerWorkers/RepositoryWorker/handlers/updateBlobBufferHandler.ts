import ckusroCore, {
  CkusroConfig,
  isTreeObject,
  toTreeEntry,
  createRepoPath,
  InternalPathEntry,
} from '@ckusro/ckusro-core';
import FS from 'fs';
import {
  addObjects,
  updateStageHead,
  updateStagePaths,
} from '../../../../modules/domain';
import { updateBlobBuffer } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { basename } from 'path';
import { RepositoryWorkerResponseActions } from '../index';

export default async function updateBlobBufferHandler(
  config: CkusroConfig,
  fs: typeof FS,
  writeInfo: PayloadType<ReturnType<typeof updateBlobBuffer>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const addResult = await stage.add(writeInfo);
  if (addResult instanceof Error) {
    return addResult;
  }

  const [[, newRoot]] = addResult;
  if (!isTreeObject(newRoot)) {
    return new Error('');
  }

  const commitResult = await stage.commit(newRoot, 'update');
  if (commitResult instanceof Error) {
    return commitResult;
  }

  const parentPath = createRepoPath(writeInfo.internalPath.repoPath).join();
  const updates = addResult
    .map(([internalPath, blobOrTree]) => {
      if (internalPath.path.length <= parentPath.length) {
        return null;
      }
      return [
        {
          path: internalPath.path.slice(parentPath.length),
          repoPath: internalPath.repoPath,
        },
        toTreeEntry(basename(internalPath.path), blobOrTree),
      ] as const;
    })
    .filter((item): item is InternalPathEntry => item != null);

  return [
    addObjects([...addResult.map(([, item]) => item), commitResult]),
    updateStageHead(commitResult.oid),
    updateStagePaths(updates),
  ];
}
