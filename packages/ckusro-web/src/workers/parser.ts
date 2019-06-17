import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Actions } from '../modules';
import { updateCurrentAst } from '../modules/objectView';
import { CommonWorkerActions } from '../modules/workerActions/common';
import {
  ParseMarkdown,
  parseMarkdown,
  ParserWorkerActions,
} from '../modules/workerActions/parser';
import { Handler, HandlerResult, newHandler, PayloadType } from './util';

export const WorkerResponseParser = 'WorkerResponse/Parser' as const;

export type ParserWorkerRequestActions = ParserWorkerActions;
export type ParserWorkerResponseActions = Actions | CommonWorkerActions;

const eventHandler = newHandler<
  ParserWorkerRequestActions,
  ParserWorkerResponseActions
>(actionHandlers, WorkerResponseParser);

self.addEventListener('message', async (e) => {
  const response = await eventHandler(e.data);
  if (response == null) {
    return;
  }

  (postMessage as any)(response);
});

function actionHandlers(
  action: ParserWorkerRequestActions,
): Handler<ParserWorkerRequestActions, ParserWorkerResponseActions> | null {
  switch (action.type) {
    case ParseMarkdown:
      return parseMarkdownHandler as any;
    default:
      return null;
  }
}

async function parseMarkdownHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
  { md }: PayloadType<ReturnType<typeof parseMarkdown>>,
): Promise<HandlerResult<ParserWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ast = core.parser.buildAst(md);

  return [updateCurrentAst(ast)];
}