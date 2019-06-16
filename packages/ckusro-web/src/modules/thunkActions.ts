import { RepoPath } from '@ckusro/ckusro-core';
import { Dispatch } from 'react';
import { updateCurrentOid as updateCurrentOidAction } from './actions/shared';
import { Actions, State } from './index';
import { parseMarkdown as parseMarkdownAction } from './workerActions/parser';
import {
  cloneRepository as cloneRepositoryAction,
  fetchHeadOids as fetchHeadOidsAction,
  fetchObject as fetchObjectAction,
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

export function parseMarkdown(md: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { parserWorkerDispatcher },
    } = getState();

    parserWorkerDispatcher(parseMarkdownAction(md));
  };
}
