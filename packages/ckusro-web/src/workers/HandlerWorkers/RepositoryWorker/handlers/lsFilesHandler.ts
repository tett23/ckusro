import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { updateRepositoryPaths } from '../../../../modules/domain';
import { lsFiles } from '../../../../modules/workerActions/repository';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';
import { splitError } from '../../../../utils';
import { errorMessage } from '../../../../modules/workerActions/common';

export default async function lsFilesHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof lsFiles>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const repos = await core.repositories().allRepositories();
  if (repos instanceof Error) {
    return repos;
  }

  const ps = repos.map((item) => item.lsFiles());
  const [items, errors] = splitError(await Promise.all(ps));

  return [updateRepositoryPaths(items.flat()), ...errors.map(errorMessage)];
}
