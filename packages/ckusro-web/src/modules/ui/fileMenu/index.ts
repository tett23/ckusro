import { combineReducers } from 'redux';
import treeViewReducer, { TreeViewState, TreeViewActions } from './treeView';
import {
  fileMenuMiscReducer,
  FileMenuMiscState,
  FileMenuMiscActions,
} from './fileMenuMisc';

export type FileMenuState = {
  misc: FileMenuMiscState;
  treeView: TreeViewState;
};

export type FileMenuActions = FileMenuMiscActions | TreeViewActions;

const fileMenuReducer = combineReducers<FileMenuState>({
  misc: fileMenuMiscReducer,
  treeView: treeViewReducer,
});

export default fileMenuReducer;
