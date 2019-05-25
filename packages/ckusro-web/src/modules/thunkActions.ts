import { Dispatch } from 'react';
import { Actions, State } from './index';
import { cloneRepository as cloneRepositoryAction } from './workerActions/repository';

export function cloneRepository(url: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(cloneRepositoryAction(url));
  };
}
