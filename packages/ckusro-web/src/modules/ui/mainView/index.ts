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
  configView: SettingsViewState;
};

export type MainViewActions = MainViewMiscActions | SettingsViewActions;

const mainViewReducer = combineReducers<MainViewState>({
  misc: mainViewMiscReducer,
  configView: settingsViewReducer,
});

export default mainViewReducer;
