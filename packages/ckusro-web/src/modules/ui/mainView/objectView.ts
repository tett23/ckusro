import { HastRoot } from '../../../components/Markdown/Hast';
import {
  SharedActions,
  updateState,
  selectBufferInfo,
  SelectBufferInfo,
  UpdateState,
} from '../../actions/shared';
import { BufferInfo, compareBufferInfo } from '../../../models/BufferInfo';

export type ObjectViewState = {
  bufferInfo: BufferInfo | null;
  currentAst: HastRoot | null;
};

export function initialObjectViewState(): ObjectViewState {
  return {
    bufferInfo: null,
    currentAst: null,
  };
}

const UpdateCurrentAst = 'ObjectView/UpdateCurrentAst' as const;

export function updateCurrentAst(ast: HastRoot | null) {
  return {
    type: UpdateCurrentAst,
    payload: ast,
  };
}

export type ObjectViewActions =
  | ReturnType<typeof selectBufferInfo>
  | ReturnType<typeof updateCurrentAst>
  | ReturnType<typeof updateState>
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
