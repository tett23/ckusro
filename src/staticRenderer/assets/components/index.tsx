import React from 'react';
import { CkusroFile, LoaderContext } from '../../../loader';
import Breadcrumbs from './Breadcrumbs';
import { Markdown } from './Markdown';
import TreeView from './TreeView';

export type Props = {
  contexts: LoaderContext[];
  files: CkusroFile[];
  markdown: {
    currentFileId: string;
    files: CkusroFile[];
  };
};

export default function App({ contexts, files, markdown }: Props) {
  const file = files.find(({ id }) => markdown.currentFileId === id);
  if (file == null) {
    throw new Error('File not found.');
  }
  const { content } = file;
  if (content == null) {
    throw new Error('CkusroFile.content must be not empty.');
  }

  return (
    <main>
      <nav>
        <Breadcrumbs namespace={file.namespace} path={file.path} />
      </nav>
      <nav>
        <TreeView contexts={contexts} files={files} />
      </nav>
      <section>
        <h1>{file.name}</h1>
        <div>
          <Markdown {...markdown} />
        </div>
      </section>
    </main>
  );
}
