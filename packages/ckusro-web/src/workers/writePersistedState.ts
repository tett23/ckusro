import { PersistedState } from '../models/PersistedState';
import { writePersistedState as writePersistedStateAction } from '../modules/workerActions/persistedState';
import PromiseWorker from 'promise-worker';
import { CkusroConfig } from '@ckusro/ckusro-core';
import { State } from '../modules';
import wrapMessage from './wrapAction';

export async function writePersistedState(
  worker: PromiseWorker,
  ps: PersistedState,
) {
  const partialConfig: Pick<CkusroConfig, 'coreId'> = {
    coreId: 'ckusro-web__dev',
  };
  const partialState: Pick<State, 'config'> = {
    config: partialConfig as CkusroConfig,
  };
  const state: State = partialState as State;
  const action = wrapMessage(state, writePersistedStateAction(ps));

  return worker.postMessage(action);
}
