import React from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import initializeStore, { State } from '../modules';
import MainContainer from './MainContainer';
import TreeViewContainer from './TreeViewContainer';

export type Props = State;

export default function App(props: Props) {
  const store = initializeStore(props);

  return (
    <Provider store={store}>
      <Main>
        <TreeViewContainer />
        <MainContainer />
      </Main>
    </Provider>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: row;
`;
