import { State } from '../modules';
import { readPersistedState as readPersistedStateAction } from '../modules/workerActions/persistedState';
import { updateState } from '../modules/actions/shared';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { CkusroConfig } from '@ckusro/ckusro-core';
import wrapMessage from './wrapAction';
import PromiseWorker from 'promise-worker';
import { PersistedState } from '../models/PersistedState';

type Result = [
  ReturnType<typeof updateState> | ReturnType<typeof errorMessage>,
];

export default async function readPersistedState(
  config: CkusroConfig,
  worker: PromiseWorker,
): Promise<PersistedState | null> {
  const partialState: Pick<State, 'config'> = {
    config,
  };
  const state: State = partialState as State;
  const action = wrapMessage(state, readPersistedStateAction());

  const [result] = await worker.postMessage<Result>(action);
  if (result == null) {
    return null;
  }
  if (result.type === ErrorMessage) {
    return null;
  }

  return result.payload as PersistedState;
}
