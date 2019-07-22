import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import PromiseWorker from 'promise-worker';
import { initializeWorkers } from './workers';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
library.add(fas);

(async () => {
  const workers = await initWorkers();
  const initialState = (await workers.readPersistedState()) || {};

  render(
    <App workers={workers} initialState={initialState} />,
    document.getElementById('root'),
  );
})();

async function initWorkers() {
  const repositoryWorker = new Worker(
    './workers/repositoryWorker/workerEntryPoint.ts',
  );
  const workers = initializeWorkers({
    main: new PromiseWorker(repositoryWorker),
  });

  return workers;
}
