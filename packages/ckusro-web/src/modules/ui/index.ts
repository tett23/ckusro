import { combineReducers } from 'redux';
import { FileMenuActions, fileMenuReducer, FileMenuState } from './fileMenu';
import { mainViewReducer, MainViewState, MainViewActions } from './mainView';

export type UIState = {
  fileMenu: FileMenuState;
  mainView: MainViewState;
};

export type UIActions = FileMenuActions | MainViewActions;

const uiReducer = combineReducers<UIState>({
  fileMenu: fileMenuReducer,
  mainView: mainViewReducer,
});

export default uiReducer;
