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
  return async (dispatch: Dispatch<Actions>, getState: () => State) => {
    if (internalPath == null) {
      return;
    }

    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    dispatch(updateMainViewType('object'));

    return repositoryWorkerDispatcher(updateByInternalPathAction(internalPath));
  };
}

export function cloneRepository(url: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(cloneRepositoryAction(url));
  };
}

export function pullRepository(repoPath: RepoPath) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(pullRepositoryAction(repoPath));
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
      (oid) =>
        createObjectManager(objectManager).fetch(oid) == null &&
        !fetchingOids.includes(oid),
    );
    if (fetchOids.length === 0) {
      return;
    }
    dispatch(addFetchingOids(fetchOids));

    return repositoryWorkerDispatcher(fetchObjectsAction(fetchOids));
  };
}

export function fetchHeadOids() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(fetchHeadOidsAction());
  };
}

export function parseMarkdown(md: string) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(parseMarkdownAction(md));
  };
}

export function updateBlobBuffer(writeInfo: GlobalBlobWriteInfo) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(updateBlobBufferAction(writeInfo));
  };
}

export function fetchStageInfo() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(fetchStageInfoAction());
  };
}

export function readPersistedState() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    return repositoryWorkerDispatcher(readPersistedStateAction());
  };
}

export function writePersistedState() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const state = getState();
    const {
      workers: { repositoryWorkerDispatcher },
    } = state;

    return repositoryWorkerDispatcher(
      writePersistedStateAction(serializeState(state)),
    );
  };
}

export function clearStageData() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const state = getState();
    const {
      workers: { repositoryWorkerDispatcher },
    } = state;

    return repositoryWorkerDispatcher(clearStageDataAction());
  };
}

export function removeAllRepositories() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const state = getState();
    const {
      workers: { repositoryWorkerDispatcher },
    } = state;

    return repositoryWorkerDispatcher(removeAllRepositoriesAction());
  };
}

export function initializePersistedState() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const state = getState();
    const {
      workers: { repositoryWorkerDispatcher },
    } = state;

    return repositoryWorkerDispatcher(initializePersistedStateAction());
  };
}
