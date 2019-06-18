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
    case PullRepository:
      return pullRepositoryHandler as any;
    case FetchObjects:
      return fetchObjectsHandler as any;
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

async function pullRepositoryHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
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

function splitError<T>(items: Array<T | Error>): [T[], Error[]] {
  return items.reduce(
    (acc, item) => {
      if (item instanceof Error) {
        acc[1].push(item);
        return acc;
      }

      acc[0].push(item);

      return acc;
    },
    [[], []] as [T[], Error[]],
  );
}

async function fetchObjectsHandler(
  config: CkusroConfig,
  fs: typeof LightningFs,
  oids: PayloadType<ReturnType<typeof fetchObjects>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ps = oids.map((oid) => core.repositories.fetchObject(oid));
  const [objects, errors] = splitError(await Promise.all(ps));

  return [...objects.map(addObject), ...errors.map(errorMessage)];
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
