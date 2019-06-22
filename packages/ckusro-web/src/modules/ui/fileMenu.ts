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

export type FileMenuActions = ReturnType<typeof updateIsDrawerOpen>;

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
    default:
      return state;
  }
}
