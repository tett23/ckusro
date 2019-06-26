import { combineReducers } from 'redux';
import mainViewMiscReducer, {
  MainViewMiscState,
  MainViewMiscActions,
} from './mainViewMisc';
import configViewReducer, {
  ConfigViewState,
  ConfigViewActions,
} from './configView';

export type MainViewState = {
  misc: MainViewMiscState;
  configView: ConfigViewState;
};

export type MainViewActions = MainViewMiscActions | ConfigViewActions;

const mainViewReducer = combineReducers<MainViewState>({
  misc: mainViewMiscReducer,
  configView: configViewReducer,
});

export default mainViewReducer;
