import { CkusroConfig } from '@ckusro/ckusro-core';
import { Store } from 'redux';
import { RepositoryWorkerResponse } from '../workers/repository';
import { State } from './index';
import { RepositoryWorkerActions } from './workerActions/repository';

export type WorkerDispatcher<WorkerActions extends FSAction> = (
  action: WorkerActions,
) => void;

export type WorkerResponse = RepositoryWorkerResponse;

export function newWorkerDispatcher<WorkerActions extends FSAction>(
  worker: Worker,
  store: Store,
): WorkerDispatcher<WorkerActions> {
  worker.addEventListener('message', (message: MessageEvent) => {
    console.log('on message', message.data);
    const res: WorkerResponse = message.data;

    if (res.payload == null) {
      return;
    }
    if (res.payload instanceof Error) {
      return;
    }
    if (res.error) {
      return;
    }

    res.payload.forEach((action) => {
      store.dispatch(action);
    });
  });

  worker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });

  return (action: WorkerActions) => {
    worker.postMessage(withConfig(withRequestId(action), store.getState));
  };
}

export type WithConfig<T extends FSAction> = T & {
  meta: { config: CkusroConfig };
};

export type WithRequestId<T extends FSAction> = T & {
  meta: { requestId: number };
};

export type WorkerRequest<Action extends FSAction> = FSAction &
  WithConfig<Action> &
  WithRequestId<Action>;

function withConfig<T extends FSAction>(
  action: T,
  getState: () => State,
): WithConfig<T> {
  return {
    ...action,
    meta: {
      ...(action.meta || {}),
      config: getState().config,
    },
  };
}

function withRequestId<T extends FSAction>(action: T): WithRequestId<T> {
  return {
    ...action,
    meta: {
      ...(action.meta || {}),
      requestId: generateRequestId().next().value,
    },
  };
}

function* generateRequestId(): IterableIterator<number> {
  let n = 0;

  while (true) {
    n++;
    yield n;
  }
}

function newDummyWorkerDispatcher<
  WorkerActions extends FSAction
>(): WorkerDispatcher<WorkerActions> {
  return (action: WorkerActions) => {
    throw new Error(`The worker have not been initialized. ${action}`);
  };
}

export type WorkersState = {
  repositoryWorkerDispatcher: WorkerDispatcher<RepositoryWorkerActions>;
};

export function initialWorkerState(): WorkersState {
  return {
    repositoryWorkerDispatcher: newDummyWorkerDispatcher<
      RepositoryWorkerActions
    >(),
  };
}

const ReplaceRepositoryWorkerDispatcher = 'Workers/ReplaceRepositoryWorkerDispatcher' as const;

export function replaceRepositoryWorkerDispatcher(
  dispatcher: WorkerDispatcher<RepositoryWorkerActions>,
) {
  return {
    type: ReplaceRepositoryWorkerDispatcher,
    payload: dispatcher,
  };
}

export type WorkersActions = ReturnType<
  typeof replaceRepositoryWorkerDispatcher
>;

export function workersReducer(
  state: WorkersState = initialWorkerState(),
  action: WorkersActions,
): WorkersState {
  switch (action.type) {
    case ReplaceRepositoryWorkerDispatcher:
      return {
        ...state,
        repositoryWorkerDispatcher: action.payload,
      };
    default:
      return state;
  }
}
