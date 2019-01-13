import React from 'react';
import { CkusroFile } from '../../../models/ckusroFile';
import { GlobalState } from '../../../models/globalState';
import { OutputContext } from '../../../models/outputContext';
import { Plugins } from '../../../models/plugins';
import Breadcrumbs from './Breadcrumbs';
import { Markdown } from './Markdown';
import RawContents from './RawContents';
import TreeView from './TreeView';

type MarkdownProps = {
  currentFileId: string;
  files: CkusroFile[];
};

export type Props = {
  globalState: GlobalState;
  markdown: MarkdownProps;
};

export default function App({ globalState, markdown }: Props) {
  return (
    <main>
      <TreeViewContainer
        outputContexts={globalState.outputContexts}
        files={globalState.files}
      />
      <MainContainer globalState={globalState} markdown={markdown} />
    </main>
  );
}

type TreeViewContainerProps = {
  outputContexts: OutputContext[];
  files: CkusroFile[];
};

function TreeViewContainer({ outputContexts, files }: TreeViewContainerProps) {
  return (
    <nav>
      <TreeView contexts={outputContexts} files={files} />
    </nav>
  );
}

export type MainContainerProps = {
  globalState: GlobalState;
  markdown: MarkdownProps;
};

function MainContainer({ globalState, markdown }: MainContainerProps) {
  const file = globalState.files.find(
    ({ id }) => markdown.currentFileId === id,
  );
  if (file == null) {
    throw new Error('File not found.');
  }
  const { content } = file;
  if (content == null) {
    throw new Error('CkusroFile.content must be not empty.');
  }

  return (
    <div>
      <BreadcrumbsContainer file={file} />
      <MarkdownContainer plugins={globalState.plugins} markdown={markdown} />
    </div>
  );
}

type BreadcrumbsContainerProps = {
  file: CkusroFile;
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
