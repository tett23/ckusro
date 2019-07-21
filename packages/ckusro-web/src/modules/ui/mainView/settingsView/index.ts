import { combineReducers } from 'redux';
import fileSystemReducer, {
  FileSystemState,
  FileSystemActions,
  initialFileSystemState,
} from './fileSystem';
import settingsViewMiscReducer, {
  SettingsViewMiscActions,
  SettingsViewMiscState,
  initialSettingsViewMiscState,
} from './settingsViewMisc';

export type SettingsViewState = {
  misc: SettingsViewMiscState;
  fileSystem: FileSystemState;
};

export function initialSettingsViewState(): SettingsViewState {
  return {
    misc: initialSettingsViewMiscState(),
    fileSystem: initialFileSystemState(),
  };
}

export type SettingsViewActions = FileSystemActions | SettingsViewMiscActions;

const settingsViewReducer = combineReducers<SettingsViewState>({
  misc: settingsViewMiscReducer,
  fileSystem: fileSystemReducer,
});

export default settingsViewReducer;
