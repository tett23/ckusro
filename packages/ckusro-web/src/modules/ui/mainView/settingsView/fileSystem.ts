import { UpdateState, updateState } from '../../../actions/shared';

export type FileSystemOpened = Record<string, boolean>;

export type FileSystemState = {
  opened: FileSystemOpened;
  preview: string | null;
};

export function initialFileSystemState(): FileSystemState {
  return {
    opened: {},
    preview: null,
  };
}

const UpdateOpened = 'UI/MainView/ConfigView/FileSystem/UpdateOpened' as const;

export function updateOpened(path: string, value: boolean) {
  return {
    type: UpdateOpened,
    payload: {
      path,
      value,
    },
  };
}

const UpdatePreview = 'UI/MainView/ConfigView/FileSystem/UpdatePreview' as const;

export function updatePreview(value: string | null) {
  return {
    type: UpdatePreview,
    payload: value,
  };
}

export type FileSystemActions =
  | ReturnType<typeof updateOpened>
  | ReturnType<typeof updatePreview>
  | ReturnType<typeof updateState>;

export default function fileSystemReducer(
  state: FileSystemState = initialFileSystemState(),
  action: FileSystemActions,
): FileSystemState {
  switch (action.type) {
    case UpdateOpened:
      return {
        ...state,
        opened: {
          ...state.opened,
          [action.payload.path]: action.payload.value,
        },
      };
    case UpdatePreview:
      return {
        ...state,
        preview: action.payload,
      };
    case UpdateState:
      if (
        action.payload.ui == null ||
        action.payload.ui.mainView == null ||
        action.payload.ui.mainView.settingsView == null ||
        action.payload.ui.mainView.settingsView.fileSystem == null
      ) {
        return state;
      }

      return {
        ...state,
        ...((action.payload.ui.mainView.settingsView.fileSystem ||
          {}) as FileSystemState),
      };
    default:
      return state;
  }
}
