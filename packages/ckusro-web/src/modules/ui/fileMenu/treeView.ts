import { UpdateState, updateState } from '../../actions/shared';
import { InternalPath } from '@ckusro/ckusro-core';

export type TreeViewState = {
  opened: InternalPath[];
};

export function initialTreeViewState(): TreeViewState {
  return {
    opened: [],
  };
}

const UpdateOpened = 'UI/FileMenu/TreeView/UpdateOpened' as const;

export function updateOpened(path: string, value: boolean) {
  return {
    type: UpdateOpened,
    payload: {
      path,
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
    case UpdateOpened:
      return {
        ...state,
        opened: {
          ...state.opened,
          [action.payload.path]: action.payload.value,
        },
      };
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
