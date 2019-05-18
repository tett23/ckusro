import React from 'react';
import { connect } from 'react-redux';
import { FileBuffer } from '../../../../../../models/FileBuffer';
import { State } from '../../modules';
import Breadcrumbs from './Breadcrumbs';

type BreadcrumbsContainerProps = {
  fileBuffers: FileBuffer[];
  fileBuffer: FileBuffer;
};

export function BreadcrumbsContainer(props: BreadcrumbsContainerProps) {
  return (
    <nav>
      <Breadcrumbs {...props} />
    </nav>
  );
}

function mapStateToProps(state: State): BreadcrumbsContainerProps {
  const {
    currentFileBufferId,
    fileBuffersState: { fileBuffers },
  } = state.fileBuffers;
  const fileBuffer = fileBuffers.find(({ id }) => currentFileBufferId === id);
  if (fileBuffer == null) {
    throw new Error();
  }

  return {
    fileBuffers,
    fileBuffer,
  };
}

export default connect(mapStateToProps)(BreadcrumbsContainer);
