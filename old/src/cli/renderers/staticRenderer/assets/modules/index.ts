import { combineReducers, createStore, DeepPartial } from 'redux';
import commonReducer, { CommonActions, CommonState } from './common';
import fileBuffersReducer, {
  FileBuffersActions,
  FileBuffersState,
} from './fileBuffers';

export type State = {
  common: CommonState;
  fileBuffers: FileBuffersState;
};

export type Actions = CommonActions | FileBuffersActions;

const reducers = combineReducers({
  common: commonReducer,
  fileBuffers: fileBuffersReducer,
});

export function initializeStore(props: DeepPartial<State>) {
  return createStore(reducers, props);
}

export default initializeStore;
