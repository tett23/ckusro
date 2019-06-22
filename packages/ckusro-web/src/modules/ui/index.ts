import { combineReducers } from 'redux';
import { FileMenuActions, fileMenuReducer, FileMenuState } from './fileMenu';
import { mainViewReducer, MainViewState } from './mainView';

export type UIState = {
  fileMenu: FileMenuState;
  mainView: MainViewState;
};

export type UIActions = FileMenuActions | MainViewState;

const uiReducer = combineReducers<UIState>({
  fileMenu: fileMenuReducer,
  mainView: mainViewReducer,
});

export default uiReducer;
