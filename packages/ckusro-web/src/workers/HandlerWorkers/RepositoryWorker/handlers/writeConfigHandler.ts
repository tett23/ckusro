import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { writeConfig } from '../../../../modules/workerActions/persistedState';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { RepositoryWorkerResponseActions } from '../index';

export default async function writeConfigHandler(
  _: CkusroConfig,
  fs: typeof FS,
  config: PayloadType<ReturnType<typeof writeConfig>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const json = JSON.stringify(config, null, 2);
  const result = await (() =>
    fs.promises.writeFile('/config.json', json, 'utf8'))().catch((err) => err);
  if (result instanceof Error) {
    return result;
  }

  return [];
}
