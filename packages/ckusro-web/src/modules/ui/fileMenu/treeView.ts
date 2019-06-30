import { UpdateState, updateState } from '../../actions/shared';
import { InternalPath, compareInternalPath } from '@ckusro/ckusro-core';
import {
  createOpenedInternalPathManager,
  OpenedInternalPathManager,
} from '../../../models/OpenedInternalPathManager';

export type TreeViewState = {
  opened: OpenedInternalPathManager;
};

export function initialTreeViewState(): TreeViewState {
  return {
    opened: [],
  };
}

const UpdateOpened = 'UI/FileMenu/TreeView/UpdateOpened' as const;

export function updateOpened(internalPath: InternalPath, value: boolean) {
  return {
    type: UpdateOpened,
    payload: {
      internalPath,
      value,
    },
  };
}

export type TreeViewActions =
  | ReturnType<typeof updateOpened>
  | ReturnType<typeof updateState>;

export default function treeViewReducer(
  state: TreeViewState = initialTreeViewState(),
  action: TreeViewActions,
): TreeViewState {
  switch (action.type) {
    case UpdateOpened: {
      const newState = createOpenedInternalPathManager(state.opened).update(
        action.payload.internalPath,
        action.payload.value,
      );
      if (state.opened === newState) {
        return state;
      }

      return { ...state, opened: newState };
    }
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.fileMenu == null ||
        action.payload.ui.fileMenu.treeView == null
      ) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.ui.fileMenu.treeView || {}) as TreeViewState),
      };
    default:
      return state;
  }
}
