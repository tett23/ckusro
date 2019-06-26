export type FileSystemState = {
  opened: Record<string, boolean>;
  preview: Buffer | null;
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

export function updatePreview(value: Buffer | null) {
  return {
    type: UpdatePreview,
    payload: value,
  };
}

export type FileSystemActions =
  | ReturnType<typeof updateOpened>
  | ReturnType<typeof updatePreview>;

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
    default:
      return state;
  }
}
