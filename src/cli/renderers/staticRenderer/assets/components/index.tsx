import React from 'react';
import styled from 'styled-components';
import MainContainer from './MainContainer';
import TreeViewContainer from './TreeViewContainer';
export default function App() {
  return (
    <Main>
      <TreeViewContainer />
      <MainContainer />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: row;
`;
