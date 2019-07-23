import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { initializePersistedState } from '../../../../modules/workerActions/persistedState';
import { HandlersResult, PayloadType } from '../../../util';
import { removePersistedState } from '../../../../models/PersistedState';
import { RepositoryWorkerResponseActions } from '../index';

export default async function initializePersistedStateHandler(
  _: CkusroConfig,
  fs: typeof FS,
  __: PayloadType<ReturnType<typeof initializePersistedState>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  await removePersistedState(fs);

  return [];
}
