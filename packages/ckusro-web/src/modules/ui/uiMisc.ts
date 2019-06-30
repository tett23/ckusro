import { updateState, UpdateState } from '../actions/shared';
import { InternalPath } from '@ckusro/ckusro-core';

export type UIMiscState = {
  currentInternalPath: InternalPath | null;
};

export function initialFileMenuMiscState(): UIMiscState {
  return {
    currentInternalPath: null,
  };
}

const UpdateCurrentInternalPath = 'UI/Misc/UpdateCurrentInternalPath' as const;

export function updateCurrentInternalPath(value: InternalPath | null) {
  return {
    type: UpdateCurrentInternalPath,
    payload: value,
  };
}

export type UIMiscActions =
  | ReturnType<typeof updateCurrentInternalPath>
  | ReturnType<typeof updateState>;

export default function uiMiscReducer(
  state: UIMiscState = initialFileMenuMiscState(),
  action: UIMiscActions,
): UIMiscState {
  switch (action.type) {
    case UpdateCurrentInternalPath:
      return {
        ...state,
        currentInternalPath: action.payload,
      };
    case UpdateState:
      if (action.payload.ui == null || action.payload.ui.misc == null) {
        return state;
      }

      return {
        ...state,
        ...(action.payload.ui.misc as UIMiscState),
      };
    default:
      return state;
  }
}
