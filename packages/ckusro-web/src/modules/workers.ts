import { Dispatch } from 'redux';
import { RepositoryWorkerResponse } from '../workers/repository';
import { RepositoryWorkerActions } from './workerActions/repository';

export type WorkerDispatcher<WorkerActions extends FSAction> = (
  action: WorkerActions,
) => void;

export type WorkerResponse = RepositoryWorkerResponse;

export function newWorkerDispatcher<WorkerActions extends FSAction>(
  worker: Worker,
  dispatcher: Dispatch,
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
      dispatcher(action);
    });
  });

  worker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });

  return (action: WorkerActions) => {
    worker.postMessage(withRequestId(action));
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
