import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Actions } from '../../modules';
import {
  CloneRepository,
  FetchHeadOids,
  FetchObjects,
  PullRepository,
  UpdateByInternalPath,
  UpdateBlobBuffer,
  FetchStageInfo,
  ClearStageData,
  RemoveAllRepositories,
} from '../../modules/workerActions/repository';
import {
  ReadPersistedState,
  WritePersistedState,
  InitializePersistedState,
} from '../../modules/workerActions/persistedState';
import { ParseMarkdown } from '../../modules/workerActions/parser';
import { Handler, newHandler } from '../util';
import registerPromiseWorker from 'promise-worker/register';
import { MainWorkerActions } from '../../modules/workers';
import initializePersistedStateHandler from './handlers/initializePersistedStateHandler';
import removeAllRepositoriesHandler from './handlers/removeAllRepositoriesHandler';
import clearStageDataHandler from './handlers/clearStageDataHandler';
import parseMarkdownHandler from './handlers/parseMarkdownHandler';
import readStateHandler from './handlers/readStateHandler';
import writeStateHandler from './handlers/writeStateHandler';
import fetchStageInfoHandler from './handlers/fetchStageInfoHandler';
import updateBlobBufferHandler from './handlers/updateBlobBufferHandler';
import fetchHeadOidsHandler from './handlers/fetchHeadOidsHandler';
import updateByInternalPathHandler from './handlers/updateByInternalPathHandler';
import fetchObjectsHandler from './handlers/fetchObjectsHandler';
import pullRepositoryHandler from './handlers/pullRepositoryHandler';
import cloneHandler from './handlers/cloneHandler';

export const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type RepositoryWorkerRequestActions = MainWorkerActions;
export type RepositoryWorkerResponseActions = Actions;

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
    case ClearStageData:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return clearStageDataHandler as any;
    case RemoveAllRepositories:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return removeAllRepositoriesHandler as any;
    case InitializePersistedState:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return initializePersistedStateHandler as any;
    default:
      return null;
  }
}
