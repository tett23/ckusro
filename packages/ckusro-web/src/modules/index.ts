import { batch } from 'react-redux';
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
import {
  GitObjectListActions,
  gitObjectListReducer,
  GitObjectListState,
} from './gitObjectList';
import persistStore from './middlewares/persistStore';
import { MiscActions, miscReducer, MiscState } from './misc';
import {
  ObjectViewActions,
  objectViewReducer,
  ObjectViewState,
} from './objectView';
import uiReducer, { UIActions, UIState } from './ui';
import { CommonWorkerActions } from './workerActions/common';
import { readPersistedState } from './workerActions/persistedState';
import {
  initialWorkerState,
  newWorkerDispatcher,
  replaceParserWorkerDispatcher,
  replaceRepositoryWorkerDispatcher,
  WorkersActions,
  workersReducer,
  WorkersState,
} from './workers';

export type State = {
  domain: DomainState;
  config: ConfigState;
  objectView: ObjectViewState;
  gitObjectList: GitObjectListState;
  misc: MiscState;
  ui: UIState;
  workers: WorkersState;
};

export type Actions =
  | ConfigActions
  | DomainActions
  | WorkersActions
  | ObjectViewActions
  | GitObjectListActions
  | MiscActions
  | CommonWorkerActions
  | UIActions
  | SharedActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
  config: configReducer,
  misc: miscReducer,
  objectView: objectViewReducer,
  gitObjectList: gitObjectListReducer,
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

  const [persistedStateWorker, persistedStateMiddleware] = persistStore();

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

  persistedStateWorker.addEventListener('message', (message: MessageEvent) => {
    batch(() => {
      message.data.forEach(store.dispatch);
    });
  });
  persistedStateWorker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });
  persistedStateWorker.postMessage(
    readPersistedState(store.getState().config.coreId),
  );

  const repositoryWorker = new Worker('../workers/repository.ts');
  const repositoryWorkerDispatcher = newWorkerDispatcher(
    repositoryWorker,
    store,
  );
  store.dispatch(replaceRepositoryWorkerDispatcher(repositoryWorkerDispatcher));

  const parserWorker = new Worker('../workers/parser.ts');
  const parserWorkerDispatcher = newWorkerDispatcher(parserWorker, store);
  store.dispatch(replaceParserWorkerDispatcher(parserWorkerDispatcher));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return store as any;
}
