import { State } from '../modules';
import withRequestId from './withRequestId';
import { readPersistedState as readPersistedStateAction } from '../modules/workerActions/persistedState';
import { updateState } from '../modules/actions/shared';
import { errorMessage, ErrorMessage } from '../modules/workerActions/common';
import { WorkerInstances } from './index';

type Result = ReturnType<typeof updateState> | ReturnType<typeof errorMessage>;

export default async function readPersistedState(
  workerInstances: WorkerInstances,
): Promise<DeepPartial<State> | null> {
  const wid = withRequestId(readPersistedStateAction());
  const action = {
    ...wid,
    meta: {
      ...wid.meta,
      config: { coreId: 'ckusro-web__dev' },
    },
  };
  const result = await workerInstances.main.postMessage<Result>(action);
  if (result.type === ErrorMessage) {
    return null;
  }

  return result.payload;
}
