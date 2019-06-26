export type MainViewTypes = 'object' | 'config';

export type MainViewMiscState = {
  mainViewType: MainViewTypes;
};

export function initialMainMiscViewState(): MainViewMiscState {
  return {
    mainViewType: 'object',
  };
}

const UpdateMainViewMiscType = 'UI/MainView/Misc/UpdateMainViewType' as const;

export function updateMainViewType(value: MainViewTypes) {
  return {
    type: UpdateMainViewMiscType,
    payload: value,
  };
}

export type MainViewMiscActions = ReturnType<typeof updateMainViewType>;

export default function mainViewMiscReducer(
  state: MainViewMiscState = initialMainMiscViewState(),
  action: MainViewMiscActions,
): MainViewMiscState {
  switch (action.type) {
    case UpdateMainViewMiscType:
      return {
        ...state,
        mainViewType: action.payload,
      };
    default:
      return state;
  }
}
