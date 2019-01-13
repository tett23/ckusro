import { CkusroFile } from '../../../../models/ckusroFile';
import { Plugins } from '../../../../models/plugins';
import parserInstance from '../../../../parserInstance';

export type Props = {
  currentFileId: string;
  files: CkusroFile[];
  plugins: Plugins;
};

export function Markdown({ plugins, currentFileId, files }: Props) {
  const file = files.find(({ id }) => id === currentFileId);
  if (file == null) {
    throw new Error(`File not found. id == ${currentFileId}`);
  }

  return buildJSX(plugins, file.content || '');
}

export function buildJSX(plugins: Plugins, content: string) {
  const jsx: JSX.Element = parserInstance(plugins).processSync(content)
    .contents as any;

  return jsx;
}
