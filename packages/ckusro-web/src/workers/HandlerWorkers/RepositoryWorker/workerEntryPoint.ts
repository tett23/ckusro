import 'core-js/stable';
import 'regenerator-runtime/runtime';
import registerPromiseWorker from 'promise-worker/register';
import mainHandler, { RepositoryWorkerRequestActions } from './index';
import { WorkerRequest } from '../../WorkerRequest';

registerPromiseWorker(
  async (message: WorkerRequest<RepositoryWorkerRequestActions>) => {
    const response = await mainHandler(message);

    return response;
  },
);
