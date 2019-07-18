import {
  applyMiddleware,
  combineReducers,
  createStore,
  DeepPartial,
  Store,
} from 'redux';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { SharedActions } from './actions/shared';
import { ConfigActions, configReducer, ConfigState } from './config';
import {
  DomainActions,
  domainReducer,
  DomainState,
  initialDomainState,
} from './domain';
import persistStore from './middlewares/persistStore';
import { MiscActions, miscReducer, MiscState } from './misc';
import uiReducer, { UIActions, UIState } from './ui';
import { CommonWorkerActions } from './workerActions/common';
import {
  initialWorkerState,
  newWorkerDispatcher,
  replaceRepositoryWorkerDispatcher,
  WorkersActions,
  workersReducer,
  WorkersState,
} from './workers';

export type State = {
  domain: DomainState;
  config: ConfigState;
  misc: MiscState;
  ui: UIState;
  workers: WorkersState;
};

export type Actions =
  | ConfigActions
  | DomainActions
  | WorkersActions
  | MiscActions
  | CommonWorkerActions
  | UIActions
  | SharedActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
  config: configReducer,
  misc: miscReducer,
  ui: uiReducer,
  workers: workersReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThunkStore<S, A extends Actions> = Store<S, A> & {
  dispatch: ThunkDispatch<S, undefined, A>;
};

export default function initializeStore(
  props: DeepPartial<State>,
): ThunkStore<State, Actions> {
  const init: DeepPartial<State> = {
    domain: { ...initialDomainState(), ...(props.domain || {}) },
    workers: initialWorkerState(),
  };

  const persistedStateMiddleware = persistStore();

  const store = createStore(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducers as any,
    init,
    applyMiddleware(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      persistedStateMiddleware as any,
      thunk as ThunkMiddleware<State, Actions>,
    ),
  );

  const repositoryWorker = new Worker('../workers/repository.ts');
  const repositoryWorkerDispatcher = newWorkerDispatcher(
    repositoryWorker,
    store,
  );
  store.dispatch(replaceRepositoryWorkerDispatcher(repositoryWorkerDispatcher));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return store as any;
}
