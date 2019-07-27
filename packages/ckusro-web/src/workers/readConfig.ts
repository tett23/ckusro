import { State } from '../modules';
import { readConfig as readConfigAction } from '../modules/workerActions/persistedState';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { CkusroConfig } from '@ckusro/ckusro-core';
import wrapMessage from './wrapAction';
import PromiseWorker from 'promise-worker';
import { readConfigResult } from '../modules/config';

type Result = [
  ReturnType<typeof readConfigResult> | ReturnType<typeof errorMessage>,
];

export default async function readConfig(
  worker: PromiseWorker,
): Promise<CkusroConfig | null> {
  const partialConfig: Pick<CkusroConfig, 'coreId'> = {
    coreId: 'ckusro-web__dev',
  };
  const partialState: Pick<State, 'config'> = {
    config: partialConfig as CkusroConfig,
  };
  const state: State = partialState as State;
  const action = wrapMessage(state, readConfigAction());

  const [result] = await worker.postMessage<Result>(action);
  if (result == null) {
    return null;
  }
  if (result.type === ErrorMessage) {
    return null;
  }

  return result.payload;
}
