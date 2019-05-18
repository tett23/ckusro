import { FileBufferId } from '../../../../../models/FileBuffer';
import { FileBuffersState as FBState } from '../../../../../models/FileBuffersState';

export type FileBuffersState = {
  fileBuffersState: FBState;
  currentFileBufferId: FileBufferId;
};

const UpdateCurrentFileBufferId: 'FileBuffers/UpdateCurrentFileBufferId' =
  'FileBuffers/UpdateCurrentFileBufferId';

export function updateCurrentFileBufferId(currentFileBufferId: FileBufferId) {
  return {
    type: UpdateCurrentFileBufferId,
    payload: currentFileBufferId,
  };
}

export type FileBuffersActions = ReturnType<typeof updateCurrentFileBufferId>;

export function initialState(): FileBuffersState {
  return {
    fileBuffersState: {
      fileBuffers: [],
      dependencyTable: {},
      invertedDependencyTable: {},
    },
    currentFileBufferId: '',
  };
}

export default function fileBuffersReducer(
  state: FileBuffersState = initialState(),
  action: FileBuffersActions,
): FileBuffersState {
  switch (action.type) {
    case UpdateCurrentFileBufferId:
      return { ...state, currentFileBufferId: action.payload };
    default:
      return state;
  }
}
