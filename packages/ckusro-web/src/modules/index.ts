import {
  Action,
  applyMiddleware,
  combineReducers,
  createStore,
  DeepPartial,
  Store,
} from 'redux';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { configReducer, ConfigState } from './config';
import {
  DomainActions,
  domainReducer,
  DomainState,
  initialDomainState,
} from './domain';
import {
  FetchingObjectsActions,
  fetchingObjectsReducer,
  FetchingObjectsState,
} from './fetchingObjects';
import {
  GitObjectListActions,
  gitObjectListReducer,
  GitObjectListState,
} from './gitObjectList';
import {
  ObjectViewActions,
  objectViewReducer,
  ObjectViewState,
} from './objectView';
import { CommonWorkerActions } from './workerActions/common';
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
  fetchingObjects: FetchingObjectsState;
  workers: WorkersState;
};

export type Actions =
  | DomainActions
  | WorkersActions
  | ObjectViewActions
  | GitObjectListActions
  | FetchingObjectsActions
  | CommonWorkerActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
  config: configReducer,
  fetchingObjects: fetchingObjectsReducer,
  objectView: objectViewReducer,
  gitObjectList: gitObjectListReducer,
  workers: workersReducer,
});

export type ThunkStore<S, A extends Action<any>> = Store<S, A> & {
  dispatch: ThunkDispatch<S, undefined, A>;
};

export default function initializeStore(
  props: DeepPartial<State>,
): ThunkStore<State, Actions> {
  const init: DeepPartial<State> = {
    domain: { ...initialDomainState(), ...(props.domain || {}) },
    workers: initialWorkerState(),
  };

  const store = createStore(
    reducers as any,
    init,
    applyMiddleware(thunk as ThunkMiddleware<State, Actions>),
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

  return store as any;
}
