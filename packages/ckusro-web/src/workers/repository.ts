import ckusroCore, {
  CkusroConfig,
  convertColorScheme,
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

const defaultConfig: CkusroConfig = {
  base: '/repositories',
  colorScheme: convertColorScheme({
    main: 'B22E42',
    accent: 'A4CE50',
    text: '090C02',
    background: 'DDE2C6',
    base: 'BBC5AA',
  }),
};

const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

const CoreId = 'ckusro-web';
const lfs = new LightningFs('ckusro-web');

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
    case FetchObject:
      return fetchObjectHandler;
    case FetchHeadOids:
      return fetchHeadOidsHandler;
    default:
      return null;
  }
}

async function cloneHandler({
  url,
}: PayloadType<ReturnType<typeof cloneRepository>>): Promise<HandlerResult> {
  const repoPath = url2RepoPath(url);
  if (repoPath instanceof Error) {
    return repoPath;
  }

  const core = ckusroCore(defaultConfig, CoreId, lfs);
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
  oid: PayloadType<ReturnType<typeof fetchObject>>,
): Promise<HandlerResult> {
  const core = ckusroCore(defaultConfig, CoreId, lfs);
  const object = await core.repositories.fetchObject(oid);
  if (object instanceof Error) {
    return object;
  }

  return [addObject(object)];
}

async function fetchHeadOidsHandler(): Promise<HandlerResult> {
  const core = ckusroCore(defaultConfig, CoreId, lfs);
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
