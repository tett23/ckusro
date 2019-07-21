import { combineReducers } from 'redux';
import fileMenuReducer, {
  FileMenuActions,
  FileMenuState,
  initialFileMenuState,
} from './fileMenu';
import mainViewReducer, {
  MainViewState,
  MainViewActions,
  initialMainViewState,
} from './mainView';
import uiMiscReducer, {
  UIMiscState,
  UIMiscActions,
  initialUIMiscState,
} from './uiMisc';

export type UIState = {
  fileMenu: FileMenuState;
  mainView: MainViewState;
  misc: UIMiscState;
};

export function initialUIState(): UIState {
  return {
    fileMenu: initialFileMenuState(),
    mainView: initialMainViewState(),
    misc: initialUIMiscState(),
  };
}

export type UIActions = FileMenuActions | MainViewActions | UIMiscActions;

const uiReducer = combineReducers<UIState>({
  fileMenu: fileMenuReducer,
  mainView: mainViewReducer,
  misc: uiMiscReducer,
});

export default uiReducer;
