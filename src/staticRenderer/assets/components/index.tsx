import React from 'react';
import { CkusroFile } from '../../../loader';

export type Props = {
  file: CkusroFile;
  files: CkusroFile[];
};

export default function App({ file }: Props) {
  return (
    <div>
      <div>{file.name}</div>
      <div>{file.content}</div>
    </div>
  );
}
