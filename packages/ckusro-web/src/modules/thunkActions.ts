import { RepoPath } from '@ckusro/ckusro-core';
import { Dispatch } from 'react';
import { updateCurrentOid as updateCurrentOidAction } from './actions/shared';
import { Actions, State } from './index';
import { addFetchingOids } from './misc';
import { parseMarkdown as parseMarkdownAction } from './workerActions/parser';
import {
  cloneRepository as cloneRepositoryAction,
  fetchHeadOids as fetchHeadOidsAction,
  fetchObjects as fetchObjectsAction,
  pullRepository as pullRepositoryAction,
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

export function pullRepository(repoPath: RepoPath) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(pullRepositoryAction(repoPath));
  };
}

export function fetchObjects(oids: string[]) {
  return async (dispatch: Dispatch<Actions>, getState: () => State) => {
    const {
      domain: { objectManager },
      workers: { repositoryWorkerDispatcher },
      misc: { fetchingOids: fetchingOids },
    } = getState();

    const fetchOids = oids.filter(
      (oid) => objectManager[oid] == null && !fetchingOids.includes(oid),
    );
    if (fetchOids.length === 0) {
      return;
    }
    dispatch(addFetchingOids(fetchOids));

    repositoryWorkerDispatcher(fetchObjectsAction(fetchOids));
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

export function parseMarkdown(md: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { parserWorkerDispatcher },
    } = getState();

    parserWorkerDispatcher(parseMarkdownAction(md));
  };
}
