import ckusroCore, { CkusroConfig, url2RepoPath } from '@ckusro/ckusro-core';
import FS from 'fs';
import { addRef } from '../../../../modules/domain';
import { cloneRepository } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';
import checkout from './internal/checkout';

export default async function cloneHandler(
  config: CkusroConfig,
  fs: typeof FS,
  { url }: PayloadType<ReturnType<typeof cloneRepository>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const core = ckusroCore(config, fs);
  const repo = await core.repositories().clone(url);
  if (repo instanceof Error) {
    return repo;
  }

  const oid = await repo.headOid();
  if (oid instanceof Error) {
    return oid;
  }

  const checkoutResult = await checkout(core, repoPath);
  if (checkoutResult instanceof Error) {
    return checkoutResult;
  }

  return [
    addRef({
      repoPath,
      name: 'HEAD',
      oid,
    }),
    ...checkoutResult,
  ];
}
