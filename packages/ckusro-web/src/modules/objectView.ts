import { FileBuffer } from '@ckusro/ckusro-core';
import { HastRoot } from '../components/Markdown/Hast';
import {
  SharedActions,
  UpdateCurrentOid,
  updateState,
  UpdateState,
} from './actions/shared';

export type ObjectViewState = {
  currentOid: string | null;
  currentFileBuffer: FileBuffer | null;
  currentAst: HastRoot | null;
};

export function initialObjectViewState(): ObjectViewState {
  return {
    currentOid: 'de753f3e8706e5f136a46dceb8fa38b4c671ead1',
    currentFileBuffer: null,
    currentAst: null,
  };
}

const UpdateFileBuffer = 'ObjectView/UpdateFileBuffer' as const;

export function updateFileBuffer(fb: FileBuffer | null) {
  return {
    type: UpdateFileBuffer,
    payload: fb,
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
  | ReturnType<typeof updateFileBuffer>
  | ReturnType<typeof updateCurrentAst>
  | ReturnType<typeof updateState>
  | SharedActions;

export function objectViewReducer(
  state: ObjectViewState = initialObjectViewState(),
  action: ObjectViewActions,
): ObjectViewState {
  switch (action.type) {
    case UpdateCurrentOid:
      if (state.currentAst == action.payload) {
        return state;
      }

      return {
        ...state,
        currentOid: action.payload,
      };
    case UpdateFileBuffer:
      if (state.currentFileBuffer == action.payload) {
        return state;
      }

      return {
        ...state,
        currentFileBuffer: action.payload,
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
      if (action.payload.objectView == null) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.objectView || {}) as ObjectViewState),
      };
    default:
      return state;
  }
}
