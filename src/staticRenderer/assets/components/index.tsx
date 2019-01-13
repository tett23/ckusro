import React from 'react';
import { CkusroFile } from '../../../models/ckusroFile';
import { GlobalState } from '../../../models/globalState';
import Breadcrumbs from './Breadcrumbs';
import { Markdown } from './Markdown';
import RawContents from './RawContents';
import TreeView from './TreeView';

export type Props = {
  globalState: GlobalState;
  markdown: {
    currentFileId: string;
    files: CkusroFile[];
  };
};

export default function App({ globalState, markdown }: Props) {
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
    <main>
      <nav>
        <Breadcrumbs namespace={file.namespace} path={file.path} />
      </nav>
      <nav>
        <TreeView
          contexts={globalState.outputContexts}
          files={globalState.files}
        />
      </nav>
      <section>
        <h1>{file.name}</h1>
        <div>
          <Markdown plugins={globalState.plugins} {...markdown} />
        </div>
      </section>
      <section>
        <RawContents files={markdown.files} />
      </section>
    </main>
  );
}
