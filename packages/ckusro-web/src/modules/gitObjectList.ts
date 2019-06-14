import { SharedActions, UpdateCurrentOid } from './actions/shared';

export type GitObjectListState = {
  currentOid: string | null;
};

export function initialObjectViewState(): GitObjectListState {
  return {
    currentOid: null,
  };
}

export type GitObjectListActions = SharedActions;

export function gitObjectListReducer(
  state: GitObjectListState = initialObjectViewState(),
  action: GitObjectListActions,
): GitObjectListState {
  switch (action.type) {
    case UpdateCurrentOid:
      if (action.meta.objectType !== 'tree') {
        return state;
      }

      return {
        ...state,
        currentOid: action.payload,
      };
    default:
      return state;
  }
}
