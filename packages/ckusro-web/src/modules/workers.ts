import { Dispatch } from 'redux';
import { RepositoryWorkerActions } from './workerActions/repository';

export type WorkerDispatcher<WorkerActions> = (action: WorkerActions) => void;

export function newWorkerDispatcher<WorkerActions>(
  worker: Worker,
  dispatcher: Dispatch,
): WorkerDispatcher<WorkerActions> {
  worker.addEventListener('message', (message: MessageEvent) => {
    console.log('on message', message);
    dispatcher(message.data);
  });
  worker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });

  return (action: WorkerActions) => {
    worker.postMessage(action);
  };
}

function newDummyWorkerDispatcher<WorkerActions>(): WorkerDispatcher<
  WorkerActions
> {
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
