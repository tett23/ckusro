import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { SharedActions } from './actions/shared';
import {
  ConfigActions,
  configReducer,
  ConfigState,
  initialConfigState,
} from './config';
import {
  DomainActions,
  domainReducer,
  DomainState,
  initialDomainState,
} from './domain';
import persistStore from './middlewares/persistStore';
import { MiscActions, miscReducer, MiscState, initialMiscState } from './misc';
import uiReducer, { UIActions, UIState, initialUIState } from './ui';
import { CommonWorkerActions } from './workerActions/common';
import { PWorkers } from '../Workers';
import merge from 'lodash.merge';

export type State = {
  domain: DomainState;
  config: ConfigState;
  misc: MiscState;
  ui: UIState;
};

export type Actions =
  | ConfigActions
  | DomainActions
  | MiscActions
  | CommonWorkerActions
  | UIActions
  | SharedActions;

export const reducers = combineReducers<State>({
  domain: domainReducer,
  config: configReducer,
  misc: miscReducer,
  ui: uiReducer,
});

function initialState(): State {
  return {
    domain: initialDomainState(),
    config: initialConfigState(),
    misc: initialMiscState(),
    ui: initialUIState(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThunkStore<S, A extends Actions> = Store<S, A> & {
  dispatch: ThunkDispatch<S, undefined, A>;
};

export default function initializeStore(
  workers: PWorkers,
  props: DeepPartial<State>,
): Store<State, Actions> {
  const init: State = merge(initialState(), {
    config: props.config,
    domain: props.domain,
  });

  const persistedStateMiddleware = persistStore(workers);

  const store: Store<State, Actions> = createStore(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducers as any,
    init,
    applyMiddleware(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      persistedStateMiddleware as any,
      thunk.withExtraArgument(workers) as ThunkMiddleware<State, Actions>,
    ),
  );

  workers.connectStore(store);

  return store;
}
