import { State } from '../modules';
import { readPersistedState as readPersistedStateAction } from '../modules/workerActions/persistedState';
import { updateState } from '../modules/actions/shared';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { CkusroConfig } from '@ckusro/ckusro-core';
import wrapMessage from './wrapAction';
import PromiseWorker from 'promise-worker';

type Result = ReturnType<typeof updateState> | ReturnType<typeof errorMessage>;

export default async function readPersistedState(
  worker: PromiseWorker,
): Promise<DeepPartial<State> | null> {
  const partialConfig: Pick<CkusroConfig, 'coreId'> = {
    coreId: 'ckusro-web__dev',
  };
  const partialState: Pick<State, 'config'> = {
    config: partialConfig as CkusroConfig,
  };
  const state: State = partialState as State;
  const action = wrapMessage(state, readPersistedStateAction());

  const result = await worker.postMessage<Result>(action);
  if (result.type === ErrorMessage) {
    return null;
  }

  return result.payload;
}
