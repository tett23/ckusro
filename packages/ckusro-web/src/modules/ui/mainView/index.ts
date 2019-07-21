import { combineReducers } from 'redux';
import mainViewMiscReducer, {
  MainViewMiscState,
  MainViewMiscActions,
  initialMainViewMiscState,
} from './mainViewMisc';
import settingsViewReducer, {
  SettingsViewState,
  SettingsViewActions,
  initialSettingsViewState,
} from './settingsView';
import objectViewReducer, {
  ObjectViewState,
  ObjectViewActions,
  initialObjectViewState,
} from './objectView';
import repositoryViewReducer, {
  RepositoryViewState,
  RepositoryViewActions,
  initialRepositoryViewState,
} from './repositoryView';

export type MainViewState = {
  misc: MainViewMiscState;
  objectView: ObjectViewState;
  repositoryView: RepositoryViewState;
  settingsView: SettingsViewState;
};

export function initialMainViewState(): MainViewState {
  return {
    misc: initialMainViewMiscState(),
    objectView: initialObjectViewState(),
    repositoryView: initialRepositoryViewState(),
    settingsView: initialSettingsViewState(),
  };
}

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
