import { combineReducers } from 'redux';
import fileSystemReducer, {
  FileSystemState,
  FileSystemActions,
} from './fileSystem';

export type ConfigViewState = {
  fileSystem: FileSystemState;
};

export type ConfigViewActions = FileSystemActions;

const configViewReducer = combineReducers<ConfigViewState>({
  fileSystem: fileSystemReducer,
});

export default configViewReducer;
