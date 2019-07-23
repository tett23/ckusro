import { Actions } from '../modules';
import { WorkerInstances, Workers } from './index';
import { WorkerRequest } from './WorkerRequest';

export default async function fetchResult<T extends keyof Workers>(
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
