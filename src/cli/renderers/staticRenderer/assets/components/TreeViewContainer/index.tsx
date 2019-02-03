import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import { FileBuffer, FileBufferId } from '../../../../../../models/FileBuffer';
import { Actions, State } from '../../modules';
import { updateCurrentFileBufferId } from '../../modules/fileBuffers';
import treeBuilder from './treeBuilder';
import TreeView from './TreeView';

type TreeViewContainerProps = {
  fileBuffers: FileBuffer[];
};

export function TreeViewContainer({ fileBuffers }: TreeViewContainerProps) {
  const roots = treeBuilder(fileBuffers);

  return (
    <Nav>
      <TreeView nodes={roots} fileBuffers={fileBuffers} />
    </Nav>
  );
}

const Nav = styled.nav`
  flex: 1;
`;

function mapStateToProps(state: State): TreeViewContainerProps {
  return {
    fileBuffers: state.fileBuffers.fileBuffersState.fileBuffers,
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
)(TreeViewContainer);
