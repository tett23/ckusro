import React from 'react';
import styled from 'styled-components';
import { FileBuffer } from '../../../models/FileBuffer';
import { GlobalState } from '../../../models/GlobalState';
import { OutputContext } from '../../../models/OutputContext';
import { Plugins } from '../../../models/plugins';
import Breadcrumbs from './Breadcrumbs';
import { Markdown } from './Markdown';
import RawContents from './RawContents';
import TreeView from './TreeView';

type MarkdownProps = {
  currentFileId: string;
  files: FileBuffer[];
};

export type Props = {
  globalState: GlobalState;
  fileBuffers: FileBuffer[];
  markdown: MarkdownProps;
};

export default function App({ globalState, fileBuffers, markdown }: Props) {
  const Main = styled.main`
    display: flex;
    flex-direction: row;
  `;

  return (
    <Main>
      <TreeViewContainer
        outputContexts={globalState.namespaces.map(
          (item) => item.outputContext,
        )}
        files={fileBuffers}
      />
      <MainContainer
        fileBuffers={fileBuffers}
        plugins={globalState.plugins}
        markdown={markdown}
      />
    </Main>
  );
}

type TreeViewContainerProps = {
  outputContexts: OutputContext[];
  files: FileBuffer[];
};

function TreeViewContainer({ outputContexts, files }: TreeViewContainerProps) {
  const Nav = styled.nav`
    flex: 1;
  `;

  return (
    <Nav>
      <TreeView contexts={outputContexts} files={files} />
    </Nav>
  );
}

export type MainContainerProps = {
  fileBuffers: FileBuffer[];
  plugins: Plugins;
  markdown: MarkdownProps;
};

function MainContainer({ plugins, fileBuffers, markdown }: MainContainerProps) {
  const file = fileBuffers.find(({ id }) => markdown.currentFileId === id);
  if (file == null) {
    throw new Error('File not found.');
  }
  const { content } = file;
  if (content == null) {
    throw new Error('CkusroFile.content must be not empty.');
  }

  const Div = styled.div`
    flex: auto;
  `;

  return (
    <Div>
      <BreadcrumbsContainer file={file} />
      <MarkdownContainer plugins={plugins} markdown={markdown} />
    </Div>
  );
}

type BreadcrumbsContainerProps = {
  file: FileBuffer;
};

function BreadcrumbsContainer({ file }: BreadcrumbsContainerProps) {
  return (
    <nav>
      <Breadcrumbs namespace={file.namespace} path={file.path} />
    </nav>
  );
}

type MarkdownContainerProps = {
  plugins: Plugins;
  markdown: MarkdownProps;
};

function MarkdownContainer({ plugins, markdown }: MarkdownContainerProps) {
  return (
    <div>
      <section>
        <Markdown plugins={plugins} {...markdown} />
      </section>
      <section>
        <RawContents files={markdown.files} />
      </section>
    </div>
  );
}
