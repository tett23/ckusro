import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import PromiseWorker from 'promise-worker';
import { initializeWorkers, PWorkers } from './Workers';
import { deserializeState } from './models/PersistedState';
import { State } from './modules';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
library.add(fas);

(async () => {
  const workers = await initWorkers();
  const initialState = await fetchInitialState(workers);

  render(
    <App workers={workers} initialState={initialState} />,
    document.getElementById('root'),
  );
})();

async function initWorkers() {
  const repositoryWorker = new Worker(
    './Workers/HandlerWorkers/RepositoryWorker/workerEntryPoint.ts',
  );
  const workers = initializeWorkers({
    main: new PromiseWorker(repositoryWorker),
  });

  return workers;
}

async function fetchInitialState(
  workers: PWorkers,
): Promise<DeepPartial<State>> {
  const config = await workers.readConfig();
  if (config == null) {
    return {};
  }

  const ps = await workers.readPersistedState(config);
  if (ps == null) {
    throw new Error('Initialize failed.');
  }

  const initialState = await deserializeState(config, ps);
  if (initialState instanceof Error) {
    throw new Error('Initialize failed.');
  }

  return initialState;
}
