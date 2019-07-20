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
import repositoryViewReducer, {
  RepositoryViewState,
  RepositoryViewActions,
} from './repositoryView';

export type MainViewState = {
  misc: MainViewMiscState;
  objectView: ObjectViewState;
  repositoryView: RepositoryViewState;
  settingsView: SettingsViewState;
};

export type MainViewActions =
  | MainViewMiscActions
  | ObjectViewActions
  | RepositoryViewActions
  | SettingsViewActions;

const mainViewReducer = combineReducers<MainViewState>({
  misc: mainViewMiscReducer,
  objectView: objectViewReducer,
  repositoryView: repositoryViewReducer,
  settingsView: settingsViewReducer,
});

export default mainViewReducer;
