import { RepoPath, InternalPath } from '@ckusro/ckusro-core';
import { Dispatch } from 'react';
import { Actions, State } from './index';
import { addFetchingOids } from './misc';
import { parseMarkdown as parseMarkdownAction } from './workerActions/parser';
import {
  cloneRepository as cloneRepositoryAction,
  fetchHeadOids as fetchHeadOidsAction,
  fetchObjects as fetchObjectsAction,
  updateByInternalPath as updateByInternalPathAction,
  pullRepository as pullRepositoryAction,
  updateBlobBuffer as updateBlobBufferAction,
  fetchStageInfo as fetchStageInfoAction,
  clearStageData as clearStageDataAction,
  removeAllRepositories as removeAllRepositoriesAction,
  lsFiles as lsFilesAction,
} from './workerActions/repository';
import { updateMainViewType } from './ui/mainView/mainViewMisc';
import { BufferInfo } from '../models/BufferInfo';
import { selectBufferInfo } from './actions/shared';
import { GlobalBlobWriteInfo } from '@ckusro/ckusro-core/lib/src/models/GlobalWriteInfo';
import {
  readPersistedState as readPersistedStateAction,
  writePersistedState as writePersistedStateAction,
  initializePersistedState as initializePersistedStateAction,
} from './workerActions/persistedState';
import { serializeState } from '../models/PersistedState';
import { createObjectManager } from '../models/ObjectManager';
import { PWorkers } from '../Workers';

export function updateByBufferInfo(bufferInfo: BufferInfo | null) {
  return async (dispatch: Dispatch<Actions>) => {
    if (bufferInfo == null) {
      return;
    }

    dispatch(updateMainViewType('object'));
    dispatch(selectBufferInfo(bufferInfo));
  };
}

export function updateByInternalPath(internalPath: InternalPath) {
  return async (
    dispatch: Dispatch<Actions>,
    _: () => State,
    workers: PWorkers,
  ) => {
    if (internalPath == null) {
      return;
    }

    dispatch(updateMainViewType('object'));

    return workers.dispatch('main', updateByInternalPathAction(internalPath));
  };
}

export function cloneRepository(url: string) {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', cloneRepositoryAction(url));
  };
}

export function pullRepository(repoPath: RepoPath) {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', pullRepositoryAction(repoPath));
  };
}

export function fetchObjects(oids: string[]) {
  return async (
    dispatch: Dispatch<Actions>,
    getState: () => State,
    workers: PWorkers,
  ) => {
    const {
      domain: {
        repositories: { objectManager },
      },
      misc: { fetchingOids: fetchingOids },
    } = getState();

    const fetchOids = oids.filter(
      (oid) =>
        createObjectManager(objectManager).fetch(oid) == null &&
        !fetchingOids.includes(oid),
    );
    if (fetchOids.length === 0) {
      return;
    }
    dispatch(addFetchingOids(fetchOids));

    return workers.dispatch('main', fetchObjectsAction(fetchOids));
  };
}

export function fetchHeadOids() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', fetchHeadOidsAction());
  };
}

export function parseMarkdown(md: string) {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', parseMarkdownAction(md));
  };
}

export function updateBlobBuffer(writeInfo: GlobalBlobWriteInfo) {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', updateBlobBufferAction(writeInfo));
  };
}

export function fetchStageInfo() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', fetchStageInfoAction());
  };
}

export function readPersistedState() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', readPersistedStateAction());
  };
}

export function writePersistedState() {
  return async (
    _: Dispatch<Actions>,
    getState: () => State,
    workers: PWorkers,
  ) => {
    const state = getState();

    return workers.dispatch(
      'main',
      writePersistedStateAction(serializeState(state)),
    );
  };
}

export function clearStageData() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', clearStageDataAction());
  };
}

export function removeAllRepositories() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', removeAllRepositoriesAction());
  };
}

export function initializePersistedState() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', initializePersistedStateAction());
  };
}

export function lsFiles() {
  return async (_: Dispatch<Actions>, __: () => State, workers: PWorkers) => {
    return workers.dispatch('main', lsFilesAction());
  };
}
