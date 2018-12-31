import React from 'react';
import { CkusroFile } from '../../../loader';
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
    <div>
      <div>{file.name}</div>
      <div>
        <Markdown text={content} />
      </div>
    </div>
  );
}
