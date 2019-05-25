export type WorkersState = {
  repositoryWorker: Worker;
};

export function initialWorkerState(): WorkersState {
  const eventsWorker = new Worker('../workers/events.ts');
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

export type WorkersActions = any;

export function workersReducer(
  state: WorkersState = initialWorkerState(),
  action: WorkersActions,
): WorkersState {
  switch (action.type) {
    default:
      return state;
  }
}
