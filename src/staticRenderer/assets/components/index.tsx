import React from 'react';
import { CkusroFile } from '../../../loader';

export type Props = {
  fileId: string;
  files: CkusroFile[];
};

export default function App({ fileId, files }: Props) {
  const file = files.find(({ id }) => fileId === id);
  if (file == null) {
    throw new Error('File not found.');
  }

  return (
    <div>
      <div>{file.name}</div>
      <div>{file.content}</div>
    </div>
  );
}
