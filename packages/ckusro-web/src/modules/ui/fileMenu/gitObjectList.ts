import {
  SharedActions,
  UpdateState,
  SelectBufferInfo,
} from '../../actions/shared';
import { compareBufferInfo, TreeBufferInfo } from '../../../models/BufferInfo';

export type GitObjectListState = {
  bufferInfo: TreeBufferInfo | null;
};

export function initialGitObjectListState(): GitObjectListState {
  return {
    bufferInfo: null,
  };
}

export type GitObjectListActions = SharedActions;

export default function gitObjectListReducer(
  state: GitObjectListState = initialGitObjectListState(),
  action: GitObjectListActions,
): GitObjectListState {
  switch (action.type) {
    case SelectBufferInfo:
      if (action.payload.type !== 'tree') {
        return state;
      }
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
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.fileMenu == null ||
        action.payload.ui.fileMenu.gitObjectList == null
      ) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.ui.fileMenu.gitObjectList ||
          {}) as GitObjectListState),
      };
    default:
      return state;
  }
}
