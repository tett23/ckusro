import { combineReducers } from 'redux';
import fileSystemReducer, {
  FileSystemState,
  FileSystemActions,
} from './fileSystem';
import settingsViewMiscReducer, {
  SettingsViewMiscActions,
  SettingsViewMiscState,
} from './settingsViewMisc';

export type ConfigViewState = {
  misc: SettingsViewMiscState;
  fileSystem: FileSystemState;
};

export type ConfigViewActions = FileSystemActions | SettingsViewMiscActions;

const configViewReducer = combineReducers<ConfigViewState>({
  misc: settingsViewMiscReducer,
  fileSystem: fileSystemReducer,
});

export default configViewReducer;
