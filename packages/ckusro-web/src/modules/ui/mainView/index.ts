import { combineReducers } from 'redux';
import mainViewMiscReducer, {
  MainViewMiscState,
  MainViewMiscActions,
} from './mainViewMisc';
import settingsViewReducer, {
  SettingsViewState,
  SettingsViewActions,
} from './settingsView';
import objectViewReducer, {
  ObjectViewState,
  ObjectViewActions,
} from './objectView';

export type MainViewState = {
  misc: MainViewMiscState;
  objectView: ObjectViewState;
  settingsView: SettingsViewState;
};

export type MainViewActions =
  | MainViewMiscActions
  | ObjectViewActions
  | SettingsViewActions;

const mainViewReducer = combineReducers<MainViewState>({
  misc: mainViewMiscReducer,
  objectView: objectViewReducer,
  settingsView: settingsViewReducer,
});

export default mainViewReducer;
