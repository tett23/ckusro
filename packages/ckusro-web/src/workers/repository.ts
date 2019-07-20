import ckusroCore, {
  CkusroConfig,
  url2RepoPath,
  isTreeObject,
  OidRepoPath,
  separateErrors,
  GitObject,
  toTreeEntry,
  createRepoPath,
} from '@ckusro/ckusro-core';
import 'core-js/stable';
import FS from 'fs';
import 'regenerator-runtime/runtime';
import { Actions } from '../modules';
import {
  addObjects,
  addRef,
  updateStageHead,
  updateStageEntries,
} from '../modules/domain';
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
  UpdateByInternalPath,
  updateByInternalPath,
  UpdateBlobBuffer,
  updateBlobBuffer,
  FetchStageInfo,
  fetchStageInfo,
} from '../modules/workerActions/repository';
import {
  ReadPersistedState,
  readPersistedState as readPersistedStateAction,
  WritePersistedState,
  writePersistedState as writePersistedStateAction,
} from '../modules/workerActions/persistedState';
import { ParseMarkdown, parseMarkdown } from '../modules/workerActions/parser';
import { splitError } from '../utils';
import { Handler, HandlerResult, newHandler, PayloadType } from './util';
import { selectBufferInfo, updateState } from '../modules/actions/shared';
import { createBufferInfo } from '../models/BufferInfo';
import { basename } from 'path';
import {
  writePersistedState,
  readPersistedState,
} from '../models/PersistedState';
import { HastRoot } from '../components/Markdown/Hast';
import { updateCurrentAst } from '../modules/ui/mainView/objectView';
import registerPromiseWorker from 'promise-worker/register';
import { MainWorkerActions } from '../modules/workers';

export const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type RepositoryWorkerRequestActions = MainWorkerActions;
export type RepositoryWorkerResponseActions = Actions | CommonWorkerActions;

const eventHandler = newHandler<
  RepositoryWorkerRequestActions,
  RepositoryWorkerResponseActions
>(actionHandlers, WorkerResponseRepository);

registerPromiseWorker(async (message) => {
  const response = await eventHandler(message);
  if (response == null) {
    return [];
  }

  return response;
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
    case UpdateBlobBuffer:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return updateBlobBufferHandler as any;
    case FetchStageInfo:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetchStageInfoHandler as any;
    case WritePersistedState:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return writeStateHandler as any;
    case ReadPersistedState:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return readStateHandler as any;
    case ParseMarkdown:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return parseMarkdownHandler as any;
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
  const repo = await core.repositories().clone(url);
  if (repo instanceof Error) {
    return repo;
  }

  const oid = await repo.headOid();
  if (oid instanceof Error) {
    return oid;
  }

  return [
    addRef({
      repository: createRepoPath(repoPath).join(),
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
  const repo = await core.repositories().fetchRepository(repoPath);
  if (repo instanceof Error) {
    return repo;
  }

  const result = await repo.pull();
  if (result instanceof Error) {
    return result;
  }

  return [
    addRef({
      repository: createRepoPath(repoPath).join(),
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
  const ps = oids.map((oid) => core.repositories().fetchObject(oid));
  const [objects, errors] = splitError(await Promise.all(ps));

  return [addObjects(objects), ...errors.map(errorMessage)];
}

async function updateByInternalPathHandler(
  config: CkusroConfig,
  fs: typeof FS,
  internalPath: PayloadType<ReturnType<typeof updateByInternalPath>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const result = await core
    .repositories()
    .fetchObjectByInternalPath(internalPath);
  if (result instanceof Error) {
    return result;
  }
  if (result == null) {
    return new Error('Object not found.');
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
  const results = await core.repositories().headOids();
  const [heads, errors] = separateErrors(results as Array<OidRepoPath | Error>);
  if (errors.length !== 0) {
    return errors[0];
  }

  return heads.map(([oid, repoPath]) => {
    return addRef({
      repository: createRepoPath(repoPath).join(),
      name: 'HEAD',
      oid,
    });
  });
}

async function updateBlobBufferHandler(
  config: CkusroConfig,
  fs: typeof FS,
  writeInfo: PayloadType<ReturnType<typeof updateBlobBuffer>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const addResult = await stage.add(writeInfo);
  if (addResult instanceof Error) {
    return addResult;
  }

  const [[, newRoot]] = addResult;
  if (!isTreeObject(newRoot)) {
    return new Error('');
  }
  const commitResult = await stage.commit(newRoot, 'update');
  if (commitResult instanceof Error) {
    return commitResult;
  }

  return [
    addObjects([...addResult.map(([, item]) => item), commitResult]),
    updateStageHead(commitResult.oid),
    updateStageEntries(
      addResult.map(([internalPath, blobOrTree]) => [
        internalPath,
        toTreeEntry(basename(internalPath.path), blobOrTree),
      ]),
    ),
  ];
}

async function fetchStageInfoHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof fetchStageInfo>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const stage = await core.stage();
  if (stage instanceof Error) {
    return stage;
  }

  const tree = await stage.headTreeObject();
  if (tree instanceof Error) {
    return tree;
  }

  const result = await stage.lsFiles();
  if (result instanceof Error) {
    return result;
  }

  const ps = result.map(([, item]) => stage.fetchByOid(item.oid));
  const results = await Promise.all(ps);
  const [maybeNull, errors] = separateErrors(results);
  if (errors.length !== 0) {
    return errors[0];
  }
  const objects = maybeNull.filter((item): item is GitObject => item != null);

  return [
    addObjects(objects),
    updateStageHead(tree.oid),
    updateStageEntries(result),
  ];
}

async function writeStateHandler(
  _: CkusroConfig,
  fs: typeof FS,
  state: PayloadType<ReturnType<typeof writePersistedStateAction>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const result = await writePersistedState(fs, state);
  if (result instanceof Error) {
    return result;
  }

  return [];
}

async function readStateHandler(
  config: CkusroConfig,
  fs: typeof FS,
  _: PayloadType<ReturnType<typeof readPersistedStateAction>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const result = await readPersistedState(config.coreId, fs);
  if (result instanceof Error) {
    return result;
  }

  return [updateState(result)];
}

async function parseMarkdownHandler(
  config: CkusroConfig,
  fs: typeof FS,
  { md }: PayloadType<ReturnType<typeof parseMarkdown>>,
): Promise<HandlerResult<RepositoryWorkerResponseActions>> {
  const core = ckusroCore(config, fs);
  const ast = await core.parser().buildAst(md);
  if (ast instanceof Error) {
    return ast;
  }

  return [updateCurrentAst(ast as HastRoot)];
}
