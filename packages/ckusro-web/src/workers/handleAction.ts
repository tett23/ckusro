import { CkusroConfig } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import FS from 'fs';
import { emptyMessage, errorMessage } from '../modules/workerActions/common';
import { WorkerRequest } from './WorkerRequest';

export type Handler<
  RequestAction extends FSAction,
  ResponseActions extends FSAction
> = (
  config: CkusroConfig,
  fs: typeof FS,
  payload: PayloadType<RequestAction>,
) => Promise<HandlersResult<ResponseActions>>;

export type HandlersResult<ResponseActions extends FSAction> =
  | ResponseActions[]
  | Error;

export type PayloadType<
  RequestActions extends FSAction
> = RequestActions['payload'];

export type Handlers<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
> = (action: RequestActions) => Handler<RequestActions, ResponseActions> | null;

export function newHandler<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
>(actionHandlers: Handlers<RequestActions, ResponseActions>) {
  return (action: WorkerRequest<RequestActions>) =>
    handler<RequestActions, ResponseActions>(actionHandlers, action);
}

async function handler<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
>(
  handlers: Handlers<RequestActions, ResponseActions>,
  action: WorkerRequest<RequestActions>,
): Promise<ResponseActions[] | ReturnType<typeof errorMessage>> {
  const { config, requestId } = action.meta;
  const fs: typeof FS = new LightningFs(config.coreId);
  console.info(`[worker]:${requestId}`, action);

  const response = await process<RequestActions, ResponseActions>(
    handlers,
    config,
    fs,
    action,
  ).catch((err: Error) => err);
  if (response instanceof Error) {
    return errorMessage(response);
  }

  return response;
}

async function process<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
>(
  handlers: Handlers<RequestActions, ResponseActions>,
  config: CkusroConfig,
  fs: typeof FS,
  action: WorkerRequest<RequestActions>,
): Promise<ResponseActions[] | Error> {
  if (config == null) {
    return new Error('');
  }

  const handler = handlers(action);
  if (handler == null) {
    return [emptyMessage()] as ResponseActions[];
  }

  const result = await handler(config, fs, action.payload).catch(
    (err: Error) => err,
  );
  if (result instanceof Error) {
    return result;
  }

  return result;
}
