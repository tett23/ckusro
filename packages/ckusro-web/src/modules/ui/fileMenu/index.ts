import { combineReducers } from 'redux';
import treeViewReducer, { TreeViewState, TreeViewActions } from './treeView';
import {
  fileMenuMiscReducer,
  FileMenuMiscState,
  FileMenuMiscActions,
} from './fileMenuMisc';
import gitObjectListReducer, {
  GitObjectListState,
  GitObjectListActions,
} from './gitObjectList';

export type FileMenuState = {
  misc: FileMenuMiscState;
  treeView: TreeViewState;
  gitObjectList: GitObjectListState;
};

export type FileMenuActions =
  | FileMenuMiscActions
  | TreeViewActions
  | GitObjectListActions;

const fileMenuReducer = combineReducers<FileMenuState>({
  misc: fileMenuMiscReducer,
  treeView: treeViewReducer,
  gitObjectList: gitObjectListReducer,
});

export default fileMenuReducer;
