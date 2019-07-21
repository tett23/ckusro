import { combineReducers } from 'redux';
import treeViewReducer, {
  TreeViewState,
  TreeViewActions,
  initialTreeViewState,
} from './treeView';
import {
  fileMenuMiscReducer,
  FileMenuMiscState,
  FileMenuMiscActions,
  initialFileMenuMiscState,
} from './fileMenuMisc';
import gitObjectListReducer, {
  GitObjectListState,
  GitObjectListActions,
  initialGitObjectListState,
} from './gitObjectList';

export type FileMenuState = {
  misc: FileMenuMiscState;
  treeView: TreeViewState;
  gitObjectList: GitObjectListState;
};

export function initialFileMenuState(): FileMenuState{
  return {
    misc: initialFileMenuMiscState(),
    treeView: initialTreeViewState(),
    gitObjectList: initialGitObjectListState(),
  };
}

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
