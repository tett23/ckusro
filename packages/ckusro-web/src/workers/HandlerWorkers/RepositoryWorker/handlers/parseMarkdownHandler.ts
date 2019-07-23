import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import FS from 'fs';
import { parseMarkdown } from '../../../../modules/workerActions/parser';
import { HandlersResult, PayloadType } from '../../../util';
import { HastRoot } from '../../../../components/Markdown/Hast';
import { updateCurrentAst } from '../../../../modules/ui/mainView/objectView';
import { RepositoryWorkerResponseActions } from '../index';

export default async function parseMarkdownHandler(
  config: CkusroConfig,
  fs: typeof FS,
  { md }: PayloadType<ReturnType<typeof parseMarkdown>>,
): Promise<HandlersResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ast = await core.parser().buildAst(md);
  if (ast instanceof Error) {
    return ast;
  }

  return [updateCurrentAst(ast as HastRoot)];
}
