import { CkusroConfig } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import FS from 'fs';
import { emptyMessage, errorMessage } from '../modules/workerActions/common';
import { WithRequestId, WorkerRequest } from '../modules/workers';

export type Handler<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
> = (
  config: CkusroConfig,
  fs: typeof FS,
  payload: PayloadType<RequestActions>,
) => Promise<HandlerResult<ResponseActions>>;

export type HandlerResult<ResponseActions extends FSAction> =
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
>(
  actionHandlers: Handlers<RequestActions, ResponseActions>,
  actionType: string,
) {
  return (action: WorkerRequest<RequestActions>) =>
    handler<RequestActions, ResponseActions>(
      actionHandlers,
      actionType,
      action,
    );
}

async function handler<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
>(
  handlers: Handlers<RequestActions, ResponseActions>,
  actionType: string,
  action: WorkerRequest<RequestActions>,
): Promise<WithRequestId<ResponseActions>> {
  const { config, requestId } = action.meta;
  const fs: typeof FS = new LightningFs(config.coreId);

  const response = await process<RequestActions, ResponseActions>(
    handlers,
    actionType,
    config,
    fs,
    action,
  ).catch((err: Error) => err);
  if (response instanceof Error) {
    return withRequestId<ResponseActions>(requestId, errorMessage(
      response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any);
  }

  return withRequestId<ResponseActions>(requestId, response);
}

async function process<
  RequestActions extends FSAction,
  ResponseActions extends FSAction
>(
  handlers: Handlers<RequestActions, ResponseActions>,
  actionType: string,
  config: CkusroConfig,
  fs: typeof FS,
  action: WorkerRequest<RequestActions>,
): Promise<ResponseActions> {
  if (config == null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return errorMessage(new Error('')) as any;
  }

  const handler = handlers(action);
  if (handler == null) {
    // TODO: wrap to empty action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return emptyMessage() as any;
  }

  const result = await handler(config, fs, action.payload).catch(
    (err: Error) => err,
  );
  if (result instanceof Error) {
    // TODO: wrap to error action
    console.log(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return errorMessage(result) as any;
  }

  return {
    type: actionType,
    payload: result,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function withRequestId<ResponseActions extends FSAction>(
  requestId: number,
  action: ResponseActions,
): WithRequestId<ResponseActions> {
  return {
    ...action,
    meta: {
      ...(action.meta || {}),
      requestId,
    },
  };
}
