import { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { readConfig } from '../../../../modules/workerActions/persistedState';
import { HandlersResult, PayloadType } from '../../../handleAction';
import { Actions } from '../../../../modules';
import { ErrorWithCode } from '../../../../models/ErrorWithCode';
import { ENOENT } from 'constants';
import { readConfigResult } from '../../../../modules/config';

export default async function readConfigHandler(
  _: CkusroConfig,
  fs: typeof FS,
  __: PayloadType<ReturnType<typeof readConfig>>,
): Promise<HandlersResult<Actions>> {
  const configJson: string | ErrorWithCode = await (async () =>
    fs.promises.readFile('/config.json', 'utf8'))().catch((err: Error) => err);
  if (configJson instanceof Error) {
    if (configJson.code === ENOENT) {
      return [readConfigResult(null)];
    }

    return configJson;
  }

  const ret = await (async () => JSON.parse(configJson))().catch((err) => err);
  if (ret instanceof Error) {
    return ret;
  }

  return [readConfigResult(ret)];
}
