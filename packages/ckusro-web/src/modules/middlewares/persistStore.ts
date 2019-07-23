import debounce from 'lodash.debounce';
import { serializeState } from '../../models/PersistedState';
import { Actions, State, ThunkStore } from '../index';
import { PWorkers } from '../../Workers';
import { writePersistedState } from '../workerActions/persistedState';

const debounced = debounce((workers: PWorkers, state: State) => {
  workers.dispatch('main', writePersistedState(serializeState(state)));
}, 3000);

export default function(workers: PWorkers) {
  const middleware = (store: ThunkStore<State, Actions>) => (
    next: (action: Actions) => Actions,
  ) => (action: Actions) => {
    const state = store.getState();
    if (state.misc.isEnablePersistedState) {
      debounced(workers, state);
    }

    next(action);
    return action;
  };

  return middleware;
}
