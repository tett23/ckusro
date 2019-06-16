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
  CloneRepository,
  cloneRepository,
  errorMessage,
  FetchHeadOids,
  FetchObject,
  fetchObject,
  RepositoryWorkerActions,
} from '../modules/workerActions/repository';
import { WithRequestId, WorkerRequest } from '../modules/workers';

const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type Handler = (
  config: CkusroConfig,
  fs: typeof LightningFs,
  payload: any,
) => Promise<HandlerResult>;
export type HandlerResult = Actions[] | Error;
export type RepositoryWorkerResponse = WithRequestId<
  FSAction<HandlerResult>
> & {
  type: typeof WorkerResponseRepository;
};

self.addEventListener('message', async (e) => {
  const action: WorkerRequest<RepositoryWorkerActions> = e.data;
  const { config, requestId } = action.meta;
  const lfs = new LightningFs(config.coreId);

  if (config == null) {
    (postMessage as any)([errorMessage(new Error(''))]);
  }

  const handler = actionHandler(action);
  if (handler == null) {
    // TODO: wrap to empty action
    return;
  }

  const result = await handler(config, lfs, action.payload).catch(
    (err: Error) => err,
  );
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
      requestId,
    },
  };

  (postMessage as any)(response);
});

type PayloadType<T extends { payload: any }> = T['payload'];

function actionHandler(action: RepositoryWorkerActions): Handler | null {
  switch (action.type) {
    case CloneRepository:
      return cloneHandler;
    case FetchObject:
      return fetchObjectHandler;
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
): Promise<HandlerResult> {
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
): Promise<HandlerResult> {
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
): Promise<HandlerResult> {
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
