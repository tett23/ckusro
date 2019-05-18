import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { allDepdendencies } from '../../../../../../models/DependencyTable';
import { FileBuffer, FileBufferId } from '../../../../../../models/FileBuffer';
import { ParserInstance } from '../../../../../../parserInstance';
import { Actions, State } from '../../modules';
import { updateCurrentFileBufferId } from '../../modules/fileBuffers';
import NotFound from '../NotFound';
import RawContents from '../RawContents';
import { Markdown } from './Markdown';

export type MarkdownContainerProps = {
  fileBuffers: FileBuffer[];
  fileBuffer: FileBuffer | null;
  parserInstance: ParserInstance;
};

export function MarkdownContainer({
  fileBuffers,
  parserInstance,
  fileBuffer,
}: MarkdownContainerProps) {
  if (fileBuffer == null) {
    return <NotFound />;
  }

  const depIds = allDepdendencies(fileBuffer.dependencies);
  const dependencies = fileBuffers.filter(({ id }) => depIds.includes(id));
  return (
    <div>
      <section>
        <Markdown
          parserInstance={parserInstance}
          fileBuffers={fileBuffers}
          fileBuffer={fileBuffer}
        />
      </section>
      <section>
        <RawContents fileBuffers={[fileBuffer].concat(dependencies)} />
      </section>
    </div>
  );
}

function mapStateToProps(state: State): MarkdownContainerProps {
  const {
    currentFileBufferId,
    fileBuffersState: { fileBuffers },
  } = state.fileBuffers;
  const { parserInstance } = state.common;

  return {
    fileBuffers,
    fileBuffer:
      fileBuffers.find(({ id }) => currentFileBufferId === id) || null,
    parserInstance,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    updateCurrentFileId(fileBufferId: FileBufferId) {
      dispatch(updateCurrentFileBufferId(fileBufferId));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkdownContainer);
