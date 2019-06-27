import { updateState, UpdateState } from '../actions/shared';

export type FileMenuState = {
  isDrawerOpen: boolean;
};

export function initialFileMenuState(): FileMenuState {
  return {
    isDrawerOpen: true,
  };
}

const UpdateIsDrawerOpen = 'UI/FileMenu/UpdateIsDrawerOpen' as const;

export function updateIsDrawerOpen(value: boolean) {
  return {
    type: UpdateIsDrawerOpen,
    payload: value,
  };
}

export type FileMenuActions =
  | ReturnType<typeof updateIsDrawerOpen>
  | ReturnType<typeof updateState>;

export function fileMenuReducer(
  state: FileMenuState = initialFileMenuState(),
  action: FileMenuActions,
): FileMenuState {
  switch (action.type) {
    case UpdateIsDrawerOpen:
      return {
        ...state,
        isDrawerOpen: action.payload,
      };
    case UpdateState:
      if (action.payload.ui == null || action.payload.ui.fileMenu == null) {
        return state;
      }

      return {
        ...state,
        ...action.payload.ui.fileMenu,
      };
    default:
      return state;
  }
}
