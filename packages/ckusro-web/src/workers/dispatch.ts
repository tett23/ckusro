import { Store } from 'redux';
import { Actions, State } from '../modules';
import { WorkerInstances, Workers } from './index';
import wrapMessage from './wrapAction';
import { WorkerRequest } from './WorkerRequest';

export async function dispatch<WorkerType extends keyof WorkerInstances>(
  store: Store<State, Actions> | null,
  workerInstances: WorkerInstances,
  workerType: WorkerType,
  action: Workers[WorkerType]['requestActions'],
): Promise<true | Error> {
  if (store == null) {
    throw new Error('The store have not been initialized.');
  }

  const worker = getWorker(store, workerInstances, workerType);
  const req = wrapMessage(store.getState(), action);
  const result = await getResult(worker, req);
  if (result instanceof Error) {
    return result;
  }

  result.forEach((action) => {
    store.dispatch(action);
  });

  return true;
}

async function getResult<T extends keyof Workers>(
  worker: WorkerInstances[T],
  action: WorkerRequest<Workers[T]['requestActions']>,
): Promise<Actions[] | Error> {
  const actions = await ((): Promise<Actions[] | Error> =>
    worker.postMessage(action))().catch((err: Error) => err);
  if (actions instanceof Error) {
    return actions;
  }

  return actions;
}

function getWorker<WorkerType extends keyof WorkerInstances>(
  store: Store<State, Actions> | null,
  workerInstances: WorkerInstances,
  workerType: WorkerType,
): WorkerInstances[WorkerType] {
  if (store == null) {
    throw new Error('The store have not been initialized.');
  }

  return workerInstances[workerType];
}
