import { updateState, UpdateState } from '../actions/shared';

export type UIMiscState = {};

export function initialFileMenuMiscState(): UIMiscState {
  return {};
}

export type UIMiscActions = ReturnType<typeof updateState>;

export default function uiMiscReducer(
  state: UIMiscState = initialFileMenuMiscState(),
  action: UIMiscActions,
): UIMiscState {
  switch (action.type) {
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
