import ckusroCore, {
  CkusroConfig,
  toInternalPath,
  url2RepoPath,
} from '@ckusro/ckusro-core';
import 'core-js/stable';
import FS from 'fs';
import 'regenerator-runtime/runtime';
import { Actions } from '../modules';
import { addObjects, addRef } from '../modules/domain';
import {
  CommonWorkerActions,
  errorMessage,
} from '../modules/workerActions/common';
import {
  CloneRepository,
  cloneRepository,
  FetchHeadOids,
  FetchObjects,
  fetchObjects,
  PullRepository,
  pullRepository,
  RepositoryWorkerActions,
  UpdateByInternalPath,
  updateByInternalPath,
} from '../modules/workerActions/repository';
import { splitError } from '../utils';
import { Handler, HandlerResult, newHandler, PayloadType } from './util';
import { selectBufferInfo } from '../modules/actions/shared';
import { createBufferInfo } from '../models/BufferInfo';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return cloneHandler as any;
    case PullRepository:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return pullRepositoryHandler as any;
    case FetchObjects:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetchObjectsHandler as any;
    case UpdateByInternalPath:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return updateByInternalPathHandler as any;
    case FetchHeadOids:
      return fetchHeadOidsHandler;
    default:
      return null;
  }
}

async function cloneHandler(
  config: CkusroConfig,
  fs: typeof FS,
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

async function pullRepositoryHandler(
  config: CkusroConfig,
  fs: typeof FS,
  repoPath: PayloadType<ReturnType<typeof pullRepository>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const repo = await core.repositories.fetchRepository(repoPath);
  if (repo instanceof Error) {
    return repo;
  }

  const result = await repo.pull();
  if (result instanceof Error) {
    return result;
  }

  return [
    addRef({
      repository: toInternalPath(repoPath),
      name: 'HEAD',
      oid: result,
    }),
  ];
}

async function fetchObjectsHandler(
  config: CkusroConfig,
  fs: typeof FS,
  oids: PayloadType<ReturnType<typeof fetchObjects>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ps = oids.map((oid) => core.repositories.fetchObject(oid));
  const [objects, errors] = splitError(await Promise.all(ps));

  return [addObjects(objects), ...errors.map(errorMessage)];
}

async function updateByInternalPathHandler(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: PayloadType<ReturnType<typeof updateByInternalPath>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const result = await core.repositories.fetchObjectByInternalPath(
    internalPath,
  );
  if (result instanceof Error) {
    return result;
  }

  const bufferInfo = createBufferInfo(
    result.type as 'tree' | 'blob',
    result.oid,
    internalPath,
  );

  return [addObjects([result]), selectBufferInfo(bufferInfo)];
}

async function fetchHeadOidsHandler(
  config: CkusroConfig,
  fs: typeof FS,
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
