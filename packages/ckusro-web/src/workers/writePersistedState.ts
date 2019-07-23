import { PersistedState } from '../models/PersistedState';
import { writePersistedState as writePersistedStateAction } from '../modules/workerActions/persistedState';
import { WorkerInstances } from './index';

export async function writePersistedState(
  workerInstances: WorkerInstances,
  ps: PersistedState,
) {
  return workerInstances.main.postMessage(writePersistedStateAction(ps));
}
