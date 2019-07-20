import ckusroCore, {
  CkusroConfig,
  url2RepoPath,
  createRepoPath,
} from '@ckusro/ckusro-core';
import FS from 'fs';
import { addRef } from '../../../modules/domain';
import { cloneRepository } from '../../../modules/workerActions/repository';
import { HandlerResult, PayloadType } from '../../util';
import { RepositoryWorkerResponseActions } from '../index';

export default async function cloneHandler(
  config: CkusroConfig,
  fs: typeof FS,
  { url }: PayloadType<ReturnType<typeof cloneRepository>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
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

  return [
    addRef({
      repository: createRepoPath(repoPath).join(),
      name: 'HEAD',
      oid,
    }),
  ];
}
