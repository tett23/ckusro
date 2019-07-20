import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { initializePersistedState } from '../../../modules/workerActions/persistedState';
import { HandlerResult, PayloadType } from '../../util';
import { removePersistedState } from '../../../models/PersistedState';
import { RepositoryWorkerResponseActions } from '../index';

export default async function initializePersistedStateHandler(
  _: CkusroConfig,
  fs: typeof FS,
  __: PayloadType<ReturnType<typeof initializePersistedState>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  await removePersistedState(fs);

  return [];
}
