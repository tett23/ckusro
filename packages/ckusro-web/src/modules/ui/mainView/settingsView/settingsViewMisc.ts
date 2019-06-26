export type SettingsViewTypes = 'Config' | 'FileSystem';

export type SettingsViewMiscState = {
  settingsViewTypes: SettingsViewTypes;
};

export function initialSettingsViewMiscState(): SettingsViewMiscState {
  return {
    settingsViewTypes: 'Config',
  };
}

const UpdateSettingsViewType = 'UI/MainView/SettingsView/Misc/UpdateSettingsViewType' as const;

export function updateSettingsViewType(value: SettingsViewTypes) {
  return {
    type: UpdateSettingsViewType,
    payload: value,
  };
}

export type SettingsViewMiscActions = ReturnType<typeof updateSettingsViewType>;

export default function settingsViewMiscReducer(
  state: SettingsViewMiscState = initialSettingsViewMiscState(),
  action: SettingsViewMiscActions,
): SettingsViewMiscState {
  switch (action.type) {
    case UpdateSettingsViewType:
      return {
        ...state,
        settingsViewTypes: action.payload,
      };
    default:
      return state;
  }
}
