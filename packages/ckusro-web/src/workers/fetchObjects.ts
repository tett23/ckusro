import { State } from '../modules';
import { GitObject } from '@ckusro/ckusro-core';
import PromiseWorker from 'promise-worker';
import wrapMessage from './wrapAction';
import { fetchObjects as fetchObjectsAction } from '../modules/workerActions/repository';
import { addObjects } from '../models/ObjectManager';
import { errorMessage } from '../modules/workerActions/common';

type Result = ReturnType<typeof addObjects> | ReturnType<typeof errorMessage>;

export default async function fetchObjects(
  worker: PromiseWorker,
  state: State,
  oids: string[],
): Promise<GitObject[] | Error> {
  console.log(oids);
  const action = wrapMessage(state, fetchObjectsAction(oids));
  console.log(action);

  const result = await worker.postMessage<Result>(action);
  console.log(result);
  console.log(result);
  if (!Array.isArray(result)) {
    return [];
  }

  return result
    .map((item) => item)
    .filter((item): item is GitObject => item != null);
}
