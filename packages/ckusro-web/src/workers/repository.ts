import ckusroCore, {
  CkusroConfig,
  toInternalPath,
  url2RepoPath,
} from '@ckusro/ckusro-core';
import LightningFs from '@isomorphic-git/lightning-fs';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Actions } from '../modules';
import { addObject, addRef } from '../modules/domain';
import { CommonWorkerActions } from '../modules/workerActions/common';
import {
  CloneRepository,
  cloneRepository,
  FetchHeadOids,
  FetchObject,
  fetchObject,
  RepositoryWorkerActions,
} from '../modules/workerActions/repository';
import { Handler, HandlerResult, newHandler, PayloadType } from './util';

export const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type RepositoryWorkerRequestActions = RepositoryWorkerActions;
export type RepositoryWorkerResponseActions = Actions | CommonWorkerActions;

const eventHandler = newHandler<
  RepositoryWorkerRequestActions,
  RepositoryWorkerResponseActions
>(actionHandlers, WorkerResponseRepository);

self.addEventListener('message', async (e) => {
  const response = await eventHandler(e.data);
  if (response == null) {
    return;
  }

  (postMessage as any)(response);
});

function actionHandlers(
  action: RepositoryWorkerRequestActions,
): Handler<
  RepositoryWorkerRequestActions,
  RepositoryWorkerResponseActions
> | null {
  switch (action.type) {
    case CloneRepository:
      return cloneHandler as any;
    case FetchObject:
      return fetchObjectHandler as any;
    case FetchHeadOids:
      return fetchHeadOidsHandler;
    default:
      return null;
  }
}

async function cloneHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
  { url }: PayloadType<ReturnType<typeof cloneRepository>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const core = ckusroCore(config, fs);
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
      repository: toInternalPath(repoPath),
      name: 'HEAD',
      oid,
    }),
  ];
}

async function fetchObjectHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
  oid: PayloadType<ReturnType<typeof fetchObject>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const object = await core.repositories.fetchObject(oid);
  if (object instanceof Error) {
    return object;
  }

  return [addObject(object)];
}

async function fetchHeadOidsHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const heads = await core.repositories.headOids();
  if (heads instanceof Error) {
    return heads;
  }

  return heads.map(([oid, repoPath]) => {
    return addRef({
      repository: toInternalPath(repoPath),
      name: 'HEAD',
      oid,
    });
  });
}
