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
} from './workerActions/repository';
import { updateMainViewType } from './ui/mainView/mainViewMisc';
import { BufferInfo } from '../models/BufferInfo';
import { selectBufferInfo } from './actions/shared';
import { GlobalBlobWriteInfo } from '@ckusro/ckusro-core/lib/src/models/GlobalWriteInfo';

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
    repositoryWorkerDispatcher(updateByInternalPathAction(internalPath));
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

export function updateBlobBuffer(writeInfo: GlobalBlobWriteInfo) {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(updateBlobBufferAction(writeInfo));
  };
}

export function fetchStageInfo() {
  return async (_: Dispatch<Actions>, getState: () => State) => {
    const {
      workers: { repositoryWorkerDispatcher },
    } = getState();

    repositoryWorkerDispatcher(fetchStageInfoAction());
  };
}
