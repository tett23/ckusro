import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { addObjects } from '../../../modules/domain';
import { errorMessage } from '../../../modules/workerActions/common';
import { fetchObjects } from '../../../modules/workerActions/repository';
import { splitError } from '../../../utils';
import { HandlersResult, PayloadType } from '../../util';
import { RepositoryWorkerResponseActions } from '../index';

export default async function fetchObjectsHandler(
  config: CkusroConfig,
  fs: typeof FS,
  oids: PayloadType<ReturnType<typeof fetchObjects>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ps = oids.map((oid) => core.repositories().fetchObject(oid));
  const [objects, errors] = splitError(await Promise.all(ps));

  return [addObjects(objects), ...errors.map(errorMessage)];
}
