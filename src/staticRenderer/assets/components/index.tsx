import React from 'react';
import { CkusroFile } from '../../../loader';
import Breadcrumbs from './Breadcrumbs';
import { Markdown } from './Markdown';

export type Props = {
  fileId: string;
  files: CkusroFile[];
};

export default function App({ fileId, files }: Props) {
  const file = files.find(({ id }) => fileId === id);
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
      <section>
        <h1>{file.name}</h1>
        <div>
          <Markdown text={content} />
        </div>
      </section>
    </main>
  );
}
