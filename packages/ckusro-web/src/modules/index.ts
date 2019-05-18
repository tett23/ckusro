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
  initialDomainStateState,
} from './domain';

export type State = {
  domain: DomainState;
};

export type Actions = DomainActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
});

export type ThunkStore<S, A extends Action<any>> = Store<S, A> & {
  dispatch: ThunkDispatch<S, undefined, A>;
};

export default function initializeStore(
  props: DeepPartial<State>,
): ThunkStore<State, Actions> {
  const init: DeepPartial<State> = {
    domain: { ...initialDomainStateState(), ...(props.domain || {}) },
  };

  return createStore(
    reducers as any,
    init,
    applyMiddleware(thunk as ThunkMiddleware<State, Actions>),
  );
}
