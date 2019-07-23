import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { readPersistedState as readPersistedStateAction } from '../../../../modules/workerActions/persistedState';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { updateState } from '../../../../modules/actions/shared';
import { readPersistedState } from '../../../../models/PersistedState';
import { RepositoryWorkerResponseActions } from '../index';

export default async function readStateHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof readPersistedStateAction>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const result = await readPersistedState(config.coreId, fs);
  if (result instanceof Error) {
    return result;
  }

  return [updateState(result)];
}
