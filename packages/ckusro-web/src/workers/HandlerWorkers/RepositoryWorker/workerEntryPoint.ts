import registerPromiseWorker from 'promise-worker/register';
import mainHandler from './index';

registerPromiseWorker(async (message) => {
  const response = await mainHandler(message);

  return response;
});
