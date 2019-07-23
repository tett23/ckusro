import { Store } from 'redux';
import { Actions, State } from '../modules';
import { WorkerInstances, Workers } from './index';
import wrapMessage from './wrapAction';
import fetchResult from './fetchResult';
import getWorker from './getWorker';

export async function dispatch<WorkerType extends keyof WorkerInstances>(
  store: Store<State, Actions> | null,
  workerInstances: WorkerInstances,
  workerType: WorkerType,
  action: Workers[WorkerType]['requestActions'],
): Promise<true | Error> {
  if (store == null) {
    throw new Error('The store have not been initialized.');
  }

  const worker = getWorker(workerInstances, workerType);
  const req = wrapMessage(store.getState(), action);
  const result = await fetchResult(worker, req);
  if (result instanceof Error) {
    return result;
  }

  result.forEach((action) => {
    store.dispatch(action);
  });

  return true;
}
