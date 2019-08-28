import ckusroCore, { CkusroConfig, isTreeObject } from '@ckusro/ckusro-core';
import FS from 'fs';
import { addObjects, updateStageHead } from '../../../../modules/domain';
import { updateBlobBuffer } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
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

  return [
    addObjects([...addResult.map(([, item]) => item), commitResult]),
    updateStageHead(commitResult.oid),
  ];
}
