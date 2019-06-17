import { FileBuffer } from '@ckusro/ckusro-core';
import { Hast } from '../components/Markdown/Hast';
import { SharedActions, UpdateCurrentOid } from './actions/shared';

export type ObjectViewState = {
  currentOid: string | null;
  currentFileBuffer: FileBuffer | null;
  currentAst: Hast | null;
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

export function updateCurrentAst(ast: Hast | null) {
  return {
    type: UpdateCurrentAst,
    payload: ast,
  };
}

export type ObjectViewActions =
  | ReturnType<typeof updateFileBuffer>
  | ReturnType<typeof updateCurrentAst>
  | SharedActions;

export function objectViewReducer(
  state: ObjectViewState = initialObjectViewState(),
  action: ObjectViewActions,
): ObjectViewState {
  switch (action.type) {
    case UpdateCurrentOid:
      return {
        ...state,
        currentOid: action.payload,
      };
    case UpdateFileBuffer:
      return {
        ...state,
        currentFileBuffer: action.payload,
      };
    case UpdateCurrentAst:
      return {
        ...state,
        currentAst: action.payload,
      };
    default:
      return state;
  }
}
