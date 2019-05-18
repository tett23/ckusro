import { createStore, Store } from 'redux';
import fileBuffersReducer, {
  FileBuffersState,
  updateCurrentFileBufferId,
} from '../../../../../../src/cli/renderers/staticRenderer/assets/modules/fileBuffers';

describe(fileBuffersReducer, () => {
  let store: Store<FileBuffersState>;
  beforeEach(() => {
    store = createStore(fileBuffersReducer);
  });

  it('updates currentFileBufferId', () => {
    store.dispatch(updateCurrentFileBufferId('test_id'));

    expect(store.getState().currentFileBufferId).toBe('test_id');
  });
});
