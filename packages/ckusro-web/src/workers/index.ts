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
import { GitObject, CkusroConfig } from '@ckusro/ckusro-core';
import readConfig from './readConfig';
import { writeConfig } from './writeConfig';

type WorkerTypes = typeof WorkerResponseRepository;

export type WorkerResponse = WithRequestId<FSAction<WorkerTypes, Actions[]>>;

export type WorkerInstances = {
  main: PromiseWorker;
};

export type Workers = {
  main: RepositoryWorker;
};

export type PWorkers = {
  readConfig: () => Promise<CkusroConfig | null>;
  writeConfig: (config: CkusroConfig) => Promise<true | Error>;
  readPersistedState: (config: CkusroConfig) => Promise<PersistedState | null>;
  writePersistedState: (persistedState: PersistedState) => Promise<[]>;
  fetchObjects: (
    config: CkusroConfig,
    oids: string[],
  ) => Promise<Array<GitObject | null> | Error>;
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
      fetchObjects: (config: CkusroConfig, oids: string[]) =>
        fetchObjects(
          getWorker(workerInstances, 'main'),
          { config } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          oids,
        ),
      readConfig: () => readConfig(getWorker(workerInstances, 'main')),
      writeConfig: (config: CkusroConfig) =>
        writeConfig(getWorker(workerInstances, 'main'), config),
      readPersistedState: (config: CkusroConfig) =>
        readPersistedState(config, getWorker(workerInstances, 'main')),
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
