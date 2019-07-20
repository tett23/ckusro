import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { addObjects } from '../../../modules/domain';
import { updateByInternalPath } from '../../../modules/workerActions/repository';
import { HandlerResult, PayloadType } from '../../util';
import { selectBufferInfo } from '../../../modules/actions/shared';
import { createBufferInfo } from '../../../models/BufferInfo';
import { RepositoryWorkerResponseActions } from '../index';

export default async function updateByInternalPathHandler(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: PayloadType<ReturnType<typeof updateByInternalPath>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const result = await core
    .repositories()
    .fetchObjectByInternalPath(internalPath);
  if (result instanceof Error) {
    return result;
  }

  if (result == null) {
    return new Error('Object not found.');
  }

  const bufferInfo = createBufferInfo(
    result.type as 'tree' | 'blob',
    result.oid,
    internalPath,
  );

  return [addObjects([result]), selectBufferInfo(bufferInfo)];
}
