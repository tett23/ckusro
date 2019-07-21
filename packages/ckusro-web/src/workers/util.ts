import { CkusroConfig } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import FS from 'fs';
import { emptyMessage, errorMessage } from '../modules/workerActions/common';
import { WithRequestId } from './withRequestId';
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
  ResponseActions extends FSAction,
  ResponseActionType extends string
>(
  actionHandlers: Handlers<RequestActions, ResponseActions>,
  responseActionType: ResponseActionType,
) {
  return (action: WorkerRequest<RequestActions>) =>
    handler<RequestActions, ResponseActions, ResponseActionType>(
      actionHandlers,
      responseActionType,
      action,
    );
}

type HandlerResult<ActionType, ResponseActions> = FSAction<
  ActionType,
  ResponseActions[]
> & {
  type: ActionType;
  payload: ResponseActions[];
};

async function handler<
  RequestActions extends FSAction,
  ResponseActions extends FSAction,
  ResponseActionType extends string
>(
  handlers: Handlers<RequestActions, ResponseActions>,
  responseActionType: ResponseActionType,
  action: WorkerRequest<RequestActions>,
): Promise<WithRequestId<HandlerResult<ResponseActionType, ResponseActions>>> {
  const { config, requestId } = action.meta;
  const fs: typeof FS = new LightningFs(config.coreId);
  console.info(`[worker]:${requestId}`, action);

  const response = await process<RequestActions, ResponseActions>(
    handlers,
    config,
    fs,
    action,
  )
    .catch((err: Error) => err)
    .then((item) => {
      if (item instanceof Error) {
        return [errorMessage(item)] as ResponseActions[];
      }

      return item;
    });

  const handlerResult: HandlerResult<ResponseActionType, ResponseActions> = {
    type: responseActionType,
    payload: response,
  };

  return withRequestId(requestId, handlerResult);
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

function withRequestId<HandlerResult extends FSAction>(
  requestId: number,
  handlerResult: HandlerResult,
): WithRequestId<HandlerResult> {
  return {
    ...handlerResult,
    meta: {
      requestId,
    },
  };
}
