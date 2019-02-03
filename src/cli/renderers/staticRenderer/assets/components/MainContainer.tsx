import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FileBuffer } from '../../../../../models/FileBuffer';
import { State } from '../modules';
import BreadcrumbsContainer from './BreadcrumbsContainer';
import MarkdownContainer from './MarkdownContainer';
import NotFound from './NotFound';

export type MainContainerProps = {
  fileBuffer: FileBuffer | null;
};

export function MainContainer({ fileBuffer }: MainContainerProps) {
  if (fileBuffer == null) {
    return <NotFound />;
  }
  return (
    <Div>
      <BreadcrumbsContainer />
      <MarkdownContainer />
    </Div>
  );
}
const Div = styled.div`
  flex: auto;
`;

function mapStateToProps(state: State): MainContainerProps {
  const {
    currentFileBufferId,
    fileBuffersState: { fileBuffers },
  } = state.fileBuffers;

  return {
    fileBuffer:
      fileBuffers.find(({ id }) => currentFileBufferId === id) || null,
  };
}

export default connect(mapStateToProps)(MainContainer);
