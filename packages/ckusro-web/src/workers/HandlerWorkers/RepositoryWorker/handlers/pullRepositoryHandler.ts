import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { addRef } from '../../../../modules/domain';
import { pullRepository } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';

export default async function pullRepositoryHandler(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: PayloadType<ReturnType<typeof pullRepository>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const repo = await core.repositories().fetchRepository(repoPath);
  if (repo instanceof Error) {
    return repo;
  }

  const result = await repo.pull();
  if (result instanceof Error) {
    return result;
  }

  return [
    addRef({
      repoPath,
      name: 'HEAD',
      oid: result,
    }),
  ];
}
