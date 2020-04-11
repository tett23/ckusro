import React from 'react';
import { buildState, buildPWorkers } from '../__fixtures__';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducers, State, Actions } from '../../src/modules';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { PWorkers } from '../../src/Workers';

type RenderHooksWithProviderOptions = {
  state?: State;
  pWorkers?: PWorkers;
};

function optionsBuilder(): RenderHooksWithProviderOptions {
  return {
    state: buildState(),
    pWorkers: buildPWorkers(),
  };
}

export default function renderHooksWithProvider<F extends Function>(
  builder: F,
  props: PropType<F>,
  options: RenderHooksWithProviderOptions = optionsBuilder(),
) {
  const store = createStore(
    reducers,
    options.state || buildState(),
    applyMiddleware(
      thunk.withExtraArgument(
        options.pWorkers || buildPWorkers(),
      ) as ThunkMiddleware<State, Actions>,
    ),
  );
  const theme = createMuiTheme();

  return renderHook(() => builder(props), {
    wrapper: (props) => (
      <ThemeProvider theme={theme}>
        <Provider {...props} store={store} />
      </ThemeProvider>
    ),
  });
}
