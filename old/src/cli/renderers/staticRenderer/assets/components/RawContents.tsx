import React, { Fragment } from 'react';
import { FileBuffer } from '../../../../../models/FileBuffer';

export type Props = {
  fileBuffers: FileBuffer[];
};

export default function RawContents({ fileBuffers }: Props) {
  const items = fileBuffers
    .map((file) => {
      if (file.content == null) {
        return <EmptyContent key={file.id} />;
      }

      return <RawContent key={file.id} file={file} />;
    })
    .flatMap((item: any, i: number) => [item, <hr key={i} />])
    .slice(0, -1);

  return <Fragment>{items}</Fragment>;
}

export type RawContentProps = {
  file: FileBuffer;
};

export function RawContent({ file }: RawContentProps) {
  return <pre>{file.content}</pre>;
}

export function EmptyContent() {
  return <div>Empty content.</div>;
}
