import { CkusroFile } from '../../../../models/ckusroFile';
import parserInstance from '../../../../parserInstance';

export type Props = {
  currentFileId: string;
  files: CkusroFile[];
};

export function Markdown({ currentFileId, files }: Props) {
  const file = files.find(({ id }) => id === currentFileId);
  if (file == null) {
    throw new Error(`File not found. id == ${currentFileId}`);
  }

  return buildJSX(file.content || '');
}

export function buildJSX(content: string) {
  const jsx = parserInstance().processSync(content).contents

  return jsx;
}
