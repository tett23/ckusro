import React, { Fragment } from 'react';
import { CkusroFile } from '../../../models/ckusroFile';

export type Props = {
  files: CkusroFile[];
};

export default function RawContents({ files }: Props) {
  const items = files
    .map((file) => {
      if (!file.isLoaded || file.content == null) {
        return <EmptyContent key={file.id} />;
      }

      return <RawContent key={file.id} file={file} />;
    })
    .flatMap((item, i) => [item, <hr key={i} />])
    .slice(0, -1);

  return <Fragment>{items}</Fragment>;
}

export type RawContentProps = {
  file: CkusroFile;
};

export function RawContent({ file }: RawContentProps) {
  return <pre>{file.content}</pre>;
}

export function EmptyContent() {
  return <div>Empty content.</div>;
}
