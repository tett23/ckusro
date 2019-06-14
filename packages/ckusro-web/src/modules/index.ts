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
  GitObjectListActions,
  gitObjectListReducer,
  GitObjectListState,
} from './gitObjectList';
import {
  ObjectViewActions,
  objectViewReducer,
  ObjectViewState,
} from './objectView';
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
  objectView: ObjectViewState;
  gitObjectList: GitObjectListState;
  workers: WorkersState;
};

export type Actions =
  | DomainActions
  | WorkersActions
  | ObjectViewActions
  | GitObjectListActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
  config: configReducer,
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

  return store as any;
}
