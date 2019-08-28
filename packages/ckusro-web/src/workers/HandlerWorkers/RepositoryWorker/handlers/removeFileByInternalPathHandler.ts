import ckusroCore, {
  CkusroConfig,
  toTreeEntry,
  createRepoPath,
  InternalPathEntry,
  createInternalPath,
} from '@ckusro/ckusro-core';
import FS from 'fs';
import {
  addObjects,
  updateStageHead,
  updateStagePaths,
} from '../../../../modules/domain';
import { removeByInternalPath } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { basename } from 'path';
import { RepositoryWorkerResponseActions } from '../index';

export default async function removeByInternalPathHandler(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: PayloadType<ReturnType<typeof removeByInternalPath>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const headTreeObject = await stage.headTreeObject();
  if (headTreeObject instanceof Error) {
    return headTreeObject;
  }

  const removeResult = await stage.removeFromTreeByPath(
    headTreeObject,
    createInternalPath(internalPath).flat(),
  );
  if (removeResult instanceof Error) {
    return removeResult;
  }

  const [[, newRoot]] = removeResult;
  if (newRoot == null) {
    return new Error();
  }

  const commitResult = await stage.commit(newRoot, 'update');
  if (commitResult instanceof Error) {
    return commitResult;
  }

  const parentPath = createRepoPath(internalPath.repoPath).join();
  const updates = removeResult
    .map(([path, blobOrTree]) => {
      if (path.length <= parentPath.length) {
        return null;
      }
      return [
        {
          path: path.slice(parentPath.length),
          repoPath: internalPath.repoPath,
        },
        toTreeEntry(basename(path), blobOrTree),
      ] as const;
    })
    .filter((item): item is InternalPathEntry => item != null);

  return [
    addObjects([...removeResult.map(([, item]) => item), commitResult]),
    updateStageHead(commitResult.oid),
    updateStagePaths(updates),
  ];
}
