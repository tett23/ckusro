import {
  Action,
  applyMiddleware,
  combineReducers,
  createStore,
  DeepPartial,
  Store,
} from 'redux';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import {
  DomainActions,
  domainReducer,
  DomainState,
  initialDomainState,
} from './domain';
import {
  initialWorkerState,
  WorkersActions,
  workersReducer,
  WorkersState,
} from './workers';

export type State = {
  domain: DomainState;
  workers: WorkersState;
};

export type Actions = DomainActions & WorkersActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
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

  return createStore(
    reducers as any,
    init,
    applyMiddleware(thunk as ThunkMiddleware<State, Actions>),
  );
}
