import debounce from 'lodash.debounce';
import { serializeState } from '../../models/PersistedState';
import { Actions, State, ThunkStore } from '../index';
import { writePersistedState } from '../workerActions/persistedState';

const debounced = debounce((state: State) => {
  state.workers.repositoryWorkerDispatcher(
    writePersistedState(serializeState(state)),
  );
}, 3000);

export default function() {
  const middleware = (store: ThunkStore<State, Actions>) => (
    next: (action: Actions) => Actions,
  ) => (action: Actions) => {
    const result = next(action);

    const state = store.getState();
    if (state.misc.isEnablePersistedState) {
      debounced(state);
    }

    return result;
  };

  return middleware;
}
