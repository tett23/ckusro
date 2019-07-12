import debounce from 'lodash.debounce';
import { serializeState } from '../../models/PersistedState';
import { Actions, State, ThunkStore } from '../index';
import { writePersistedState } from '../workerActions/persistedState';

const debounced = debounce((worker: Worker, state: State) => {
  const persistedState = writePersistedState(serializeState(state));
  worker.postMessage(persistedState);
}, 3000);

export default function() {
  const worker = new Worker('../../workers/persistState.ts');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const middleware = (store: ThunkStore<State, Actions>) => (next: any) => (
    action: Actions,
  ) => {
    const result = next(action);

    const state = store.getState();
    if (state.misc.isEnablePersistedState) {
      debounced(worker, state);
    }

    return result;
  };

  return [worker, middleware] as const;
}
