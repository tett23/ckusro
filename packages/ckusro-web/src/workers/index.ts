import { Store } from 'redux';
import PromiseWorker from 'promise-worker';
import { Actions, State } from '../modules';
import { WithRequestId } from './wrapAction/withRequestId';
import {
  WorkerResponseRepository,
  RepositoryWorker,
} from './HandlerWorkers/RepositoryWorker';
import { PersistedState } from '../models/PersistedState';
import { dispatch } from './dispatch';
import readPersistedState from './readPersistedState';
import { writePersistedState } from './writePersistedState';
import getWorker from './getWorker';
import fetchObjects from './fetchObjects';
import { GitObject } from '@ckusro/ckusro-core';

type WorkerTypes = typeof WorkerResponseRepository;

export type WorkerResponse = WithRequestId<FSAction<WorkerTypes, Actions[]>>;

export type WorkerInstances = {
  main: PromiseWorker;
};

export type Workers = {
  main: RepositoryWorker;
};

export type PWorkers = {
  readPersistedState: () => Promise<PersistedState | null>;
  writePersistedState: (persistedState: PersistedState) => Promise<[]>;
  fetchObjects: (oids: string[]) => Promise<Array<GitObject | null> | Error>;
  connectStore: (store: Store<State, Actions>) => void;
  dispatch: <WorkerType extends keyof WorkerInstances>(
    worker: WorkerType,
    action: Workers[WorkerType]['requestActions'],
  ) => Promise<true | Error>;
};

let pWorkers: PWorkers | null = null;

export function getWorkers(): PWorkers | Error {
  if (pWorkers == null) {
    return new Error('workers have not been initialized.');
  }

  return pWorkers;
}

export function initializeWorkers(workerInstances: WorkerInstances): PWorkers {
  pWorkers = createWorkers(workerInstances);

  return pWorkers;
}

function createWorkers(workerInstances: WorkerInstances): PWorkers {
  const ret = ((): PWorkers => {
    let _store: Store<State, Actions> | null = null;
    const item: PWorkers = {
      connectStore: (store: Store<State, Actions>) => {
        _store = store;
      },
      fetchObjects: (oids: string[]) =>
        fetchObjects(
          getWorker(workerInstances, 'main'),
          { config: { coreId: 'ckusro-web__dev' } } as any,

          oids,
        ),
      readPersistedState: () =>
        readPersistedState(getWorker(workerInstances, 'main')),
      writePersistedState: (ps: PersistedState) =>
        writePersistedState(getWorker(workerInstances, 'main'), ps),
      dispatch: <WorkerType extends keyof WorkerInstances>(
        workerType: WorkerType,
        action: Workers[WorkerType]['requestActions'],
      ) => dispatch(_store, workerInstances, workerType, action),
    };

    return item;
  })();

  return ret;
}
