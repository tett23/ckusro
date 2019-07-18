import { updateState, UpdateState } from '../../actions/shared';

export type FileMenuMiscState = {
  isDrawerOpen: boolean;
};

export function initialFileMenuMiscState(): FileMenuMiscState {
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

export type FileMenuMiscActions =
  | ReturnType<typeof updateIsDrawerOpen>
  | ReturnType<typeof updateState>;

export function fileMenuMiscReducer(
  state: FileMenuMiscState = initialFileMenuMiscState(),
  action: FileMenuMiscActions,
): FileMenuMiscState {
  switch (action.type) {
    case UpdateIsDrawerOpen:
      return {
        ...state,
        isDrawerOpen: action.payload,
      };
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.fileMenu == null ||
        action.payload.ui.fileMenu.misc == null
      ) {
        return state;
      }

      return {
        ...state,
        ...action.payload.ui.fileMenu.misc,
      };
    default:
      return state;
  }
}
