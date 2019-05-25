export type WorkersState = {
  repositoryWorker: Worker;
};

export function initialWorkerState(): WorkersState {
  const eventsWorker = new Worker('../workers/repository.ts');
  eventsWorker.addEventListener('message', (message: MessageEvent) => {
    console.log('on message', message);
  });
  eventsWorker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });
  eventsWorker.postMessage('hoge');

  return {
    repositoryWorker: eventsWorker,
  };
}

export type WorkersActions = {};

export function workersReducer(
  state: WorkersState = initialWorkerState(),
  action: WorkersActions,
): WorkersState {
  return state;
}
