import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Actions } from '../modules';
import { addRef } from '../modules/domain';
import {
  CloneRepository,
  cloneRepository,
  errorMessage,
  RepositoryWorkerActions,
} from '../modules/workerActions/repository';

import ckusroCore, { CkusroConfig } from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';

const defaultConfig: CkusroConfig = {
  base: '/repositories',
};

const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type Handler = (payload: any) => Promise<HandlerResult>;
export type HandlerResult = Actions[] | Error;
export type RepositoryWorkerResponse = WithRequestId<
  FSAction<HandlerResult>
> & {
  type: typeof WorkerResponseRepository;
};

self.addEventListener('message', async (e) => {
  const action: WithRequestId<RepositoryWorkerActions> = e.data;
  console.log(action);

  const handler = actionHandler(action);
  if (handler == null) {
    // TODO: wrap to empty action
    return;
  }

  const result = await handler(action.payload).catch((err: Error) => err);
  if (result instanceof Error) {
    // TODO: wrap to error action
    console.log(result);
    (postMessage as any)([errorMessage(result)]);
    return;
  }

  const response: RepositoryWorkerResponse = {
    type: WorkerResponseRepository,
    payload: result,
    meta: {
      requestId: action.meta.requestId,
    },
  };

  (postMessage as any)(response);
});

type PayloadType<T extends { payload: any }> = T['payload'];

function actionHandler(action: RepositoryWorkerActions): Handler | null {
  switch (action.type) {
    case CloneRepository:
      return cloneHandler;
    default:
      return null;
  }
}

async function cloneHandler({
  url,
}: PayloadType<ReturnType<typeof cloneRepository>>): Promise<HandlerResult> {
  const core = ckusroCore(defaultConfig, 'ckusro', new LightningFs('hoge'));
  const repo = await core.repositories.clone(url);
  if (repo instanceof Error) {
    return repo;
  }

  const oid = await repo.headOid();
  if (oid instanceof Error) {
    return oid;
  }

  return [
    addRef({
      repository: url,
      name: 'HEAD',
      oid,
    }),
  ];
}
