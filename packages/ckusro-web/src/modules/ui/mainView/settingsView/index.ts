import { combineReducers } from 'redux';
import fileSystemReducer, {
  FileSystemState,
  FileSystemActions,
} from './fileSystem';
import settingsViewMiscReducer, {
  SettingsViewMiscActions,
  SettingsViewMiscState,
} from './settingsViewMisc';

export type SettingsViewState = {
  misc: SettingsViewMiscState;
  fileSystem: FileSystemState;
};

export type SettingsViewActions = FileSystemActions | SettingsViewMiscActions;

const settingsViewReducer = combineReducers<SettingsViewState>({
  misc: settingsViewMiscReducer,
  fileSystem: fileSystemReducer,
});

export default settingsViewReducer;
