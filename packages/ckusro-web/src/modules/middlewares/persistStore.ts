import { serializeState } from '../../models/PersistedState';
import { Actions, State, ThunkStore } from '../index';
import { writePersistedState } from '../workerActions/persistedState';

export default function() {
  const worker = new Worker('../../workers/persistState.ts');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const middleware = (store: ThunkStore<State, Actions>) => (next: any) => (
    action: Actions,
  ) => {
    const result = next(action);

    const state = store.getState();
    if (state.misc.isEnablePersistedState) {
      const persistedState = writePersistedState(serializeState(state));
      worker.postMessage(persistedState);
    }

    return result;
  };

  return [worker, middleware] as const;
}
