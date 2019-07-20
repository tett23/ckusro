import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { clearStageManager } from '../../../modules/domain';
import { clearStageData } from '../../../modules/workerActions/repository';
import { HandlerResult, PayloadType } from '../../util';
import { RepositoryWorkerResponseActions } from '../index';

export default async function clearStageDataHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof clearStageData>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const clearResult = await stage.clear();
  if (clearResult instanceof Error) {
    return clearResult;
  }

  return [clearStageManager()];
}
