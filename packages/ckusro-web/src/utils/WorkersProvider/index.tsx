import { createContext, useContext } from 'react';
import { PWorkers, WorkerInfos, WorkerInstances } from '../../Workers';

const WorkersContext = createContext<PWorkers | null>(null);

export const WorkersProvider = WorkersContext.Provider;

export function useWorkers(): PWorkers {
  const ret = useContext(WorkersContext);
  if (ret == null) {
    throw new Error('WorkersProvider have not been initialized.');
  }

  return ret;
}

export function useWorkerDispatch<WorkerType extends keyof WorkerInstances>(
  workerType: WorkerType,
  action: WorkerInfos[WorkerType]['requestActions'],
): () => Promise<true | Error> {
  const workers = useContext(WorkersContext);
  if (workers == null) {
    throw new Error('WorkersProvider have not been initialized.');
  }

  return () => workers.dispatch(workerType, action);
}
