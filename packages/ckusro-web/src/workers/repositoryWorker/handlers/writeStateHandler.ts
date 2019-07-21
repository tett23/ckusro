import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { writePersistedState as writePersistedStateAction } from '../../../modules/workerActions/persistedState';
import { HandlersResult, PayloadType } from '../../util';
import { writePersistedState } from '../../../models/PersistedState';
import { RepositoryWorkerResponseActions } from '../index';

export default async function writeStateHandler(
  _: CkusroConfig,
  fs: typeof FS,
  state: PayloadType<ReturnType<typeof writePersistedStateAction>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const result = await writePersistedState(fs, state);
  if (result instanceof Error) {
    return result;
  }

  return [];
}
