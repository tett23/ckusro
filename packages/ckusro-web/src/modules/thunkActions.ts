import { Dispatch } from 'react';
import { updateCurrentOid as updateCurrentOidAction } from './actions/shared';
import { Actions, State } from './index';
import {
  cloneRepository as cloneRepositoryAction,
  fetchHeadOids as fetchHeadOidsAction,
  fetchObject as fetchObjectAction,
} from './workerActions/repository';

export function updateCurrentOid(oid: string | null) {
  return async (dispatch: Dispatch<Actions>, getState: () => State) => {
    const {
      domain: { objectManager },
    } = getState();

    const objectType = (objectManager[oid || ''] || { type: undefined }).type;

    dispatch(updateCurrentOidAction(oid, objectType));
  };
}

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
      domain: { objectManager },
      workers: { repositoryWorkerDispatcher },
    } = getState();

    if (objectManager[oid] != null) {
      return;
    }

    repositoryWorkerDispatcher(fetchObjectAction(oid));
  };
}

export function fetchHeadOids() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(fetchHeadOidsAction());
  };
}
