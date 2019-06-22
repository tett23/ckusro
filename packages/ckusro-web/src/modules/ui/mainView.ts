export type MainViewTypes = 'object';

export type MainViewState = {
  mainViewType: MainViewTypes;
};

export function initialMainViewState(): MainViewState {
  return {
    mainViewType: 'object',
  };
}

const UpdateMainViewType = 'UI/MainView/UpdateMainViewType' as const;

export function updateMainViewType(value: MainViewTypes) {
  return {
    type: UpdateMainViewType,
    payload: value,
  };
}

export type MainViewActions = ReturnType<typeof updateMainViewType>;

export function mainViewReducer(
  state: MainViewState = initialMainViewState(),
  action: MainViewActions,
): MainViewState {
  switch (action.type) {
    case UpdateMainViewType:
      return {
        ...state,
        mainViewType: action.payload,
      };
    default:
      return state;
  }
}
