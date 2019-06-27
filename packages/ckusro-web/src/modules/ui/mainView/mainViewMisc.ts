import { updateState, UpdateState } from '../../actions/shared';

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

export type MainViewMiscActions =
  | ReturnType<typeof updateMainViewType>
  | ReturnType<typeof updateState>;

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
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.mainView == null ||
        action.payload.ui.mainView.misc == null
      ) {
        return state;
      }

      return {
        ...state,
        ...action.payload.ui.mainView.misc,
      };
    default:
      return state;
  }
}
