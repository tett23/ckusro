import { Dispatch } from 'react';
import { Actions, State } from './index';
import {
  cloneRepository as cloneRepositoryAction,
  fetchObject as fetchObjectAction,
} from './workerActions/repository';

export function cloneRepository(url: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(cloneRepositoryAction(url));
  };
}

export function fetchObject(oid: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(fetchObjectAction(oid));
  };
}
