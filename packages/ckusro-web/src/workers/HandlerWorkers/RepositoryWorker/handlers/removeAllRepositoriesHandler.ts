import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { removeAllRepositories } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { clearRepositories } from '../../../../modules/config';
import { RepositoryWorkerResponseActions } from '../index';

export default async function removeAllRepositoriesHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof removeAllRepositories>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.repositories();
  if (stage instanceof Error) {
    return stage;
  }

  const clearResult = await stage.removeAllRepositories();
  if (clearResult instanceof Error) {
    return clearResult;
  }

  return [clearRepositories()];
}
