import { SharedActions, UpdateCurrentOid } from './actions/shared';

export type ObjectViewState = {
  currentOid: string | null;
};

export function initialObjectViewState(): ObjectViewState {
  return {
    currentOid: null,
  };
}

export type ObjectViewActions = SharedActions;

export function objectViewReducer(
  state: ObjectViewState = initialObjectViewState(),
  action: ObjectViewActions,
): ObjectViewState {
  switch (action.type) {
    case UpdateCurrentOid:
      return {
        ...state,
        currentOid: action.payload,
      };
    default:
      return state;
  }
}
