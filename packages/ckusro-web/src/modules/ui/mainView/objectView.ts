import { HastRoot } from '../../../components/Markdown/Hast';
import {
  SharedActions,
  updateState,
  selectBufferInfo,
  SelectBufferInfo,
  UpdateState,
} from '../../actions/shared';
import { BufferInfo, compareBufferInfo } from '../../../models/BufferInfo';

export type ViewModes = 'View' | 'Edit';

export type ObjectViewState = {
  bufferInfo: BufferInfo | null;
  currentAst: HastRoot | null;
  viewMode: ViewModes;
};

export function initialObjectViewState(): ObjectViewState {
  return {
    bufferInfo: null,
    currentAst: null,
    viewMode: 'View',
  };
}

const UpdateCurrentAst = 'ObjectView/UpdateCurrentAst' as const;

export function updateCurrentAst(ast: HastRoot | null) {
  return {
    type: UpdateCurrentAst,
    payload: ast,
  };
}

const UpdateViewMode = 'ObjectView/UpdateViewMode' as const;

export function updateViewMode(value: ViewModes) {
  return {
    type: UpdateViewMode,
    payload: value,
  };
}

export type ObjectViewActions =
  | ReturnType<typeof selectBufferInfo>
  | ReturnType<typeof updateCurrentAst>
  | ReturnType<typeof updateState>
  | ReturnType<typeof updateViewMode>
  | SharedActions;

export default function objectViewReducer(
  state: ObjectViewState = initialObjectViewState(),
  action: ObjectViewActions,
): ObjectViewState {
  switch (action.type) {
    case SelectBufferInfo:
      if (state.bufferInfo == null) {
        return { ...state, bufferInfo: action.payload };
      }
      if (compareBufferInfo(state.bufferInfo, action.payload)) {
        return state;
      }

      return {
        ...state,
        bufferInfo: action.payload,
      };
    case UpdateCurrentAst:
      if (state.currentAst == action.payload) {
        return state;
      }

      return {
        ...state,
        currentAst: action.payload,
      };
    case UpdateViewMode:
      if (state.viewMode === action.payload) {
        return state;
      }

      return {
        ...state,
        viewMode: action.payload,
      };
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.mainView == null ||
        action.payload.ui.mainView.objectView == null
      ) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.ui.mainView.objectView || {}) as ObjectViewState),
      };
    default:
      return state;
  }
}
