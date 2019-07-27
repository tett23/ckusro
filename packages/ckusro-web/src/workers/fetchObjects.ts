import { State } from '../modules';
import { GitObject } from '@ckusro/ckusro-core';
import PromiseWorker from 'promise-worker';
import wrapMessage from './wrapAction';
import { fetchObjects as fetchObjectsAction } from '../modules/workerActions/repository';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { addObjects } from '../modules/domain';

type Result = Array<
  ReturnType<typeof addObjects> | ReturnType<typeof errorMessage>
>;

export default async function fetchObjects(
  worker: PromiseWorker,
  state: State,
  oids: string[],
): Promise<GitObject[] | Error> {
  const action = wrapMessage(state, fetchObjectsAction(oids));

  const [result] = await worker.postMessage<Result>(action);
  if (result == null || result.type === ErrorMessage) {
    return [];
  }
  if (!Array.isArray(result.payload)) {
    return [];
  }

  return result.payload
    .map((item) => item)
    .filter((item): item is GitObject => item != null);
}
