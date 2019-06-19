import {
  SharedActions,
  UpdateCurrentOid,
  UpdateState,
  updateState,
} from './actions/shared';

export type GitObjectListState = {
  currentOid: string | null;
};

export function initialGitObjectListState(): GitObjectListState {
  return {
    currentOid: null,
  };
}

export type GitObjectListActions =
  | ReturnType<typeof updateState>
  | SharedActions;

export function gitObjectListReducer(
  state: GitObjectListState = initialGitObjectListState(),
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
    case UpdateState:
      if (action.payload.gitObjectList == null) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.gitObjectList || {}) as GitObjectListState),
      };
    default:
      return state;
  }
}
