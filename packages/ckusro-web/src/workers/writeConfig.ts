import { writeConfig as writeConfigAction } from '../modules/workerActions/persistedState';
import PromiseWorker from 'promise-worker';
import { CkusroConfig } from '@ckusro/ckusro-core';
import { State } from '../modules';
import wrapMessage from './wrapAction';

export async function writeConfig(worker: PromiseWorker, config: CkusroConfig) {
  const partialState: Pick<State, 'config'> = {
    config: config as CkusroConfig,
  };
  const state: State = partialState as State;
  const action = wrapMessage(state, writeConfigAction(config));

  return worker.postMessage(action);
}
