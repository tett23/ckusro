import { createContext, useContext } from 'react';
import { PWorkers } from '../../workers';

const WorkersContext = createContext<PWorkers | null>(null);

export const WorkersProvider = WorkersContext.Provider;

export function useWorkers(): PWorkers {
  const ret = useContext(WorkersContext);
  if (ret == null) {
    throw new Error('WorkersProvider have not been initialized');
  }

  return ret;
}
