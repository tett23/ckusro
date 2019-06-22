import { combineReducers } from 'redux';
import { FileMenuActions, fileMenuReducer, FileMenuState } from './fileMenu';

export type UIState = {
  fileMenu: FileMenuState;
};

export type UIActions = FileMenuActions;

const uiReducer = combineReducers<UIState>({
  fileMenu: fileMenuReducer,
});

export default uiReducer;
