import { CkusroConfig } from '@ckusro/ckusro-core';
import { Store } from 'redux';
import { Actions, State } from './index';
import { RepositoryWorkerActions } from './workerActions/repository';
import { batch } from 'react-redux';
import sequenceGenerator from '../utils/sequenceGenerator';
import PromiseWorker from 'promise-worker';
import { ParserWorkerActions } from './workerActions/parser';
import { PersistStateWorkerActions } from './workerActions/persistedState';

export type WorkerDispatcher<WorkerActions extends FSAction> = (
  action: WorkerActions,
) => Promise<true | Error>;

export type MainWorkerActions =
  | RepositoryWorkerActions
  | ParserWorkerActions
  | PersistStateWorkerActions;

export type WorkerResponse<T> = WithRequestId<FSAction<T[] | T>>;

export function newWorkerDispatcher<WorkerActions extends FSAction>(
  worker: Worker,
  store: Store,
): WorkerDispatcher<WorkerActions> {
  const promiseWorker = new PromiseWorker(worker);

  worker.addEventListener('error', (err: ErrorEvent) => {
    console.error('on error', err);
  });

  return async (action: WorkerActions) => {
    const req = withConfig(withRequestId(action), store.getState);
    console.time(`[ui]:${req.meta.requestId}`); // eslint-disable-line no-console

    const result = await promiseWorker
      .postMessage<WorkerResponse<Actions>>(req)
      .catch((err: Error) => err);
    console.timeEnd(`[ui]:${req.meta.requestId}`); // eslint-disable-line no-console
    if (result instanceof Error) {
      return result;
    }
    if (result == null) {
      return new Error('result is null');
    }
    if (result.payload == null) {
      return new Error('payload is null');
    }

    batch(() => {
      const actions = Array.isArray(result.payload)
        ? result.payload
        : [result.payload];
      actions.forEach((action) => {
        if (action === '' || action == null) {
          return;
        }

        console.info(`[ui]:${result.meta.requestId} receive message`, action);

        store.dispatch(action);
      });
    });

    return true;
  };
}

export type WithConfig<T extends FSAction> = T & {
  meta: { config: CkusroConfig };
};

export type WithRequestId<T extends FSAction> = T & {
  meta: { requestId: number };
};

export type WorkerRequest<Action extends FSAction> = Action &
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

const requestIdGen = sequenceGenerator();

function withRequestId<T extends FSAction>(action: T): WithRequestId<T> {
  return {
    ...action,
    meta: {
      ...(action.meta || {}),
      requestId: requestIdGen.next().value,
    },
  };
}

function newDummyWorkerDispatcher<
  WorkerActions extends FSAction
>(): WorkerDispatcher<WorkerActions> {
  return (action: WorkerActions) => {
    throw new Error(`The worker have not been initialized. ${action}`);
  };
}

export type WorkersState = {
  repositoryWorkerDispatcher: WorkerDispatcher<MainWorkerActions>;
};

export function initialWorkerState(): WorkersState {
  return {
    repositoryWorkerDispatcher: newDummyWorkerDispatcher<MainWorkerActions>(),
  };
}

const ReplaceRepositoryWorkerDispatcher = 'Workers/ReplaceRepositoryWorkerDispatcher' as const;

export function replaceRepositoryWorkerDispatcher(
  dispatcher: WorkerDispatcher<MainWorkerActions>,
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
