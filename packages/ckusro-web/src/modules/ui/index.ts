import { combineReducers } from 'redux';
import fileMenuReducer, { FileMenuActions, FileMenuState } from './fileMenu';
import mainViewReducer, { MainViewState, MainViewActions } from './mainView';
import uiMiscReducer, { UIMiscState, UIMiscActions } from './uiMisc';

export type UIState = {
  fileMenu: FileMenuState;
  mainView: MainViewState;
  misc: UIMiscState;
};

export type UIActions = FileMenuActions | MainViewActions | UIMiscActions;

const uiReducer = combineReducers<UIState>({
  fileMenu: fileMenuReducer,
  mainView: mainViewReducer,
  misc: uiMiscReducer,
});

export default uiReducer;
