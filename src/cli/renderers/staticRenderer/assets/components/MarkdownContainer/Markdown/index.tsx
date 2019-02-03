import { FileBuffer } from '../../../../../../../models/FileBuffer';
import { ParserInstance } from '../../../../../../../parserInstance';

export type Props = {
  fileBuffers: FileBuffer[];
  fileBuffer: FileBuffer;
  parserInstance: ParserInstance;
};

export function Markdown({ fileBuffer, parserInstance }: Props) {
  return buildJSX(parserInstance, fileBuffer.content || '');
}

export function buildJSX(
  parserInstance: ParserInstance,
  content: string | Buffer,
) {
  const jsx: JSX.Element = parserInstance.processSync(content).contents as any;

  return jsx;
}
