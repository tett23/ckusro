import { CkusroConfig } from '@ckusro/ckusro-core';
import { Store } from 'redux';
import { Actions, State } from './index';
import { ParserWorkerActions } from './workerActions/parser';
import { RepositoryWorkerActions } from './workerActions/repository';
import { batch } from 'react-redux';
import sequenceGenerator from '../utils/sequenceGenerator';

export type WorkerDispatcher<WorkerActions extends FSAction> = (
  action: WorkerActions,
) => void;

export type WorkerResponse<T> = WithRequestId<FSAction<T[] | T>>;

export function newWorkerDispatcher<WorkerActions extends FSAction>(
  worker: Worker,
  store: Store,
): WorkerDispatcher<WorkerActions> {
  worker.addEventListener('message', (message: MessageEvent) => {
    const res: WorkerResponse<Actions> = message.data;

    if (res.payload == null) {
      return;
    }
    if (res.error) {
      return;
    }

    batch(() => {
      if (res.payload == null) {
        return;
      }

      const actions = Array.isArray(res.payload) ? res.payload : [res.payload];
      actions.forEach((action) => {
        if (action == null) {
          return;
        }

        console.info(`[ui]:${res.meta.requestId} receive message`, action);
        store.dispatch(action);
      });
    });
  });

  worker.addEventListener('error', (err: ErrorEvent) => {
    console.error('on error', err);
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
  repositoryWorkerDispatcher: WorkerDispatcher<RepositoryWorkerActions>;
  parserWorkerDispatcher: WorkerDispatcher<ParserWorkerActions>;
};

export function initialWorkerState(): WorkersState {
  return {
    repositoryWorkerDispatcher: newDummyWorkerDispatcher<
      RepositoryWorkerActions
    >(),
    parserWorkerDispatcher: newDummyWorkerDispatcher<ParserWorkerActions>(),
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

const ReplaceParserWorkerDispatcher = 'Workers/ReplaceParserWorkerDispatcher' as const;

export function replaceParserWorkerDispatcher(
  dispatcher: WorkerDispatcher<ParserWorkerActions>,
) {
  return {
    type: ReplaceParserWorkerDispatcher,
    payload: dispatcher,
  };
}

export type WorkersActions =
  | ReturnType<typeof replaceRepositoryWorkerDispatcher>
  | ReturnType<typeof replaceParserWorkerDispatcher>;

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
    case ReplaceParserWorkerDispatcher:
      return {
        ...state,
        parserWorkerDispatcher: action.payload,
      };
    default:
      return state;
  }
}
