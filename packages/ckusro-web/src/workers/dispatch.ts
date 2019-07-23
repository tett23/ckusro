import { Store } from 'redux';
import { Actions, State } from '../modules';
import withRequestId from './withRequestId';
import withConfig from './withConfig';
import { WorkerInstances, Workers, WorkerResponse } from './index';

export async function dispatch<WorkerType extends keyof WorkerInstances>(
  store: Store<State, Actions> | null,
  workerInstances: WorkerInstances,
  workerName: WorkerType,
  action: Workers[WorkerType]['requestActions'],
): Promise<true | Error> {
  if (store == null) {
    return new Error('The store have not been initialized.');
  }

  const req = withConfig(withRequestId(action), store.getState);
  const result = await (async () => {
    const resp: Promise<WorkerResponse> = workerInstances[
      workerName
    ].postMessage(req);
    return resp;
  })().catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  result.payload.forEach((action) => {
    store.dispatch(action);
  });

  return true;
}
