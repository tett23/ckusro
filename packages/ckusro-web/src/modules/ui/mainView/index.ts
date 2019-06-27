import { combineReducers } from 'redux';
import mainViewMiscReducer, {
  MainViewMiscState,
  MainViewMiscActions,
} from './mainViewMisc';
import settingsViewReducer, {
  SettingsViewState,
  SettingsViewActions,
} from './settingsView';

export type MainViewState = {
  misc: MainViewMiscState;
  settingsView: SettingsViewState;
};

export type MainViewActions = MainViewMiscActions | SettingsViewActions;

const mainViewReducer = combineReducers<MainViewState>({
  misc: mainViewMiscReducer,
  settingsView: settingsViewReducer,
});

export default mainViewReducer;
