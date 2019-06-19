import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  readPersistedState,
  writePersistedState,
} from '../models/PersistedState';
import { Actions } from '../modules';
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
  const response = await handler(action.payload);
  if (response.length >= 1) {
    (postMessage as any)(response);
  }
});

function actionHandlers(action: PersistStateWorkerRequestActions) {
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
  const result = await writePersistedState(state);
  if (result instanceof Error) {
    return result;
  }

  return [];
}

async function readStateHandler(
  coreId: PayloadType<ReturnType<typeof readPersistedStateAction>>,
): Promise<HandlerResult<PersistStateWorkerResponseActions>> {
  const result = await readPersistedState(coreId);
  if (result instanceof Error) {
    return result;
  }

  return [];
}
