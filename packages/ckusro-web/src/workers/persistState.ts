import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  getFsInstance,
  readPersistedState,
  writePersistedState,
} from '../models/PersistedState';
import { Actions } from '../modules';
import { updateState } from '../modules/actions/shared';
import { errorMessage } from '../modules/workerActions/common';
import {
  PersistStateWorkerActions,
  ReadPersistedState,
  readPersistedState as readPersistedStateAction,
  WritePersistedState,
  writePersistedState as writePersistedStateAction,
} from '../modules/workerActions/persistedState';
import { HandlerResult, PayloadType } from './util';

export const WorkerResponsePersistState = 'WorkerResponse/PersistState' as const;

export type PersistStateWorkerRequestActions = PersistStateWorkerActions;
export type PersistStateWorkerResponseActions = Actions;

self.addEventListener('message', async (e) => {
  const action: PersistStateWorkerRequestActions = e.data;

  const handler = actionHandlers(action);
  if (handler == null) {
    return;
  }

  const response = await handler(action.payload);
  if (response instanceof Error) {
    return errorMessage(response) as any;
  }

  if (response.length > 0) {
    (postMessage as any)(response);
  }
});

type Handler = (
  payload: PayloadType<PersistStateWorkerRequestActions>,
) => Promise<HandlerResult<PersistStateWorkerResponseActions>>;

function actionHandlers(
  action: PersistStateWorkerRequestActions,
): Handler | null {
  switch (action.type) {
    case WritePersistedState:
      return writeStateHandler as any;
    case ReadPersistedState:
      return readStateHandler as any;
    default:
      return null;
  }
}

async function writeStateHandler(
  state: PayloadType<ReturnType<typeof writePersistedStateAction>>,
): Promise<HandlerResult<PersistStateWorkerResponseActions>> {
  const fs = await getFsInstance(state.config.coreId);
  if (fs instanceof Error) {
    return fs;
  }

  const result = await writePersistedState(fs, state);
  if (result instanceof Error) {
    return result;
  }

  return [];
}

async function readStateHandler(
  coreId: PayloadType<ReturnType<typeof readPersistedStateAction>>,
): Promise<HandlerResult<PersistStateWorkerResponseActions>> {
  const fs = await getFsInstance(coreId);
  if (fs instanceof Error) {
    return fs;
  }

  const result = await readPersistedState(coreId, fs);
  if (result instanceof Error) {
    return result;
  }

  return [updateState(result)];
}
