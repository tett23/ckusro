import { combineReducers, createStore, DeepPartial } from 'redux';
import commonReducer, { CommonState } from './common';
import fileBuffersReducer, { FileBuffersState } from './fileBuffers';

export type State = {
  common: CommonState;
  fileBuffers: FileBuffersState;
};

const reducers = combineReducers({
  common: commonReducer,
  fileBuffers: fileBuffersReducer,
});

export function initializeStore(props: DeepPartial<State>) {
  return createStore(reducers, props);
}

export default initializeStore;
