import { Store } from 'redux';
import PromiseWorker from 'promise-worker';
import { Actions, State } from '../modules';
import withRequestId, { WithRequestId } from './withRequestId';
import withConfig from './withConfig';
import {
  WorkerResponseRepository,
  RepositoryWorker,
} from './HandlerWorkers/RepositoryWorker';
import { PersistedState } from '../models/PersistedState';
import {
  readPersistedState,
  writePersistedState,
} from '../modules/workerActions/persistedState';
import { updateState } from '../modules/actions/shared';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { fetchObjects } from '../modules/workerActions/repository';
import { GitObject } from '@ckusro/ckusro-core';

type WorkerTypes = typeof WorkerResponseRepository;

export type WorkerResponse = WithRequestId<FSAction<WorkerTypes, Actions[]>>;

export type WorkerInstances = {
  main: PromiseWorker;
};

type Workers = {
  main: RepositoryWorker;
};

export type PWorkers = {
  readPersistedState: () => Promise<DeepPartial<State> | null>;
  fetchObjects: (oids: string[]) => Promise<GitObject[] | Error | null>;
  writePersistedState: (persistedState: PersistedState) => Promise<[]>;
  connectStore: (store: Store<State, Actions>) => void;
  dispatch: <WorkerType extends keyof WorkerInstances>(
    worker: WorkerType,
    action: Workers[WorkerType]['requestActions'],
  ) => Promise<true | Error>;
};

let pWorkers: PWorkers;

export function getWorkers(): PWorkers {
  if (pWorkers == null) {
    throw new Error('workers have not been initialized.');
  }
  return pWorkers;
}

export function initializeWorkers(workerInstances: WorkerInstances) {
  return ((): PWorkers => {
    pWorkers = createWorkers(workerInstances);

    return pWorkers;
  })();
}

function createWorkers(workerInstances: WorkerInstances) {
  return ((): PWorkers => {
    let _store: Store<State, Actions> | null = null;
    const item: PWorkers = {
      readPersistedState: async () => {
        const wid = withRequestId(readPersistedState());
        const action = {
          ...wid,
          meta: {
            ...wid.meta,
            config: { coreId: 'ckusro-web__dev' },
          },
        };
        const result = await workerInstances.main.postMessage<
          ReturnType<typeof updateState> | ReturnType<typeof errorMessage>
        >(action);
        if (result.type === ErrorMessage) {
          return null;
        }

        return result.payload;
      },
      writePersistedState: (ps: PersistedState) => {
        return workerInstances.main.postMessage(writePersistedState(ps));
      },
      connectStore: (store: Store<State, Actions>) => {
        _store = store;
      },
      dispatch: <WorkerType extends keyof WorkerInstances>(
        workerType: WorkerType,
        action: Workers[WorkerType]['requestActions'],
      ) => dispatch(_store, workerInstances, workerType, action),
      fetchOids: (oids: string[]) => {
        const result = dispatch(
          store,
          workerInstances,
          'main',
          fetchObjects(oids),
        );
      },
    };

    return item;
  })();
}

async function process() {}

async function dispatch<WorkerType extends keyof WorkerInstances>(
  store: Store<State, Actions> | null,
  workerInstances: WorkerInstances,
  workerName: WorkerType,
  action: Workers[WorkerType]['requestActions'],
): Promise<true | Error> {
  if (store == null) {
    return new Error('The store have not been initialized.');
  }

  const req = withConfig(withRequestId(action), store.getState);
  const result = await (async () => {
    const resp: Promise<WorkerResponse> = workerInstances[
      workerName
    ].postMessage(req);

    return resp;
  })().catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  result.payload.forEach((action) => {
    store.dispatch(action);
  });

  return true;
}
