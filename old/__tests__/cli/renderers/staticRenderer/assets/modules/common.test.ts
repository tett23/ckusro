import { createStore, Store } from 'redux';
import commonReducer, {
  CommonState,
  updateParserInstance,
} from '../../../../../../src/cli/renderers/staticRenderer/assets/modules/common';
import { ParserInstance } from '../../../../../../src/parserInstance';

describe(updateParserInstance, () => {
  let store: Store<CommonState>;
  beforeEach(() => {
    store = createStore(commonReducer);
  });

  it('updates parserInstance', () => {
    const dummy = (jest.fn() as any) as ParserInstance;
    store.dispatch(updateParserInstance(dummy));

    expect(store.getState().parserInstance).toBe(dummy);
  });
});
