import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Actions } from '../../../modules';
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
  RepositoryWorkerActions,
} from '../../../modules/workerActions/repository';
import {
  ReadPersistedState,
  WritePersistedState,
  InitializePersistedState,
  PersistStateWorkerActions,
} from '../../../modules/workerActions/persistedState';
import {
  ParseMarkdown,
  ParserWorkerActions,
} from '../../../modules/workerActions/parser';
import { Handler, newHandler } from '../../util';
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

export type RepositoryWorkerRequestActions =
  | RepositoryWorkerActions
  | ParserWorkerActions
  | PersistStateWorkerActions;
export type RepositoryWorkerResponseActions = Actions;

export type RepositoryWorker = {
  workerType: typeof WorkerResponseRepository;
  requestActions: RepositoryWorkerRequestActions;
  responseActions: RepositoryWorkerResponseActions;
};

export default newHandler<
  RepositoryWorkerRequestActions,
  RepositoryWorkerResponseActions,
  typeof WorkerResponseRepository
>(actionHandlers, WorkerResponseRepository);

function actionHandlers(
  action: RepositoryWorkerRequestActions,
): Handler<
  RepositoryWorkerRequestActions,
  RepositoryWorkerResponseActions
> | null {
  switch (action.type) {
    case CloneRepository:
      return cloneHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case PullRepository:
      return pullRepositoryHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case FetchObjects:
      return fetchObjectsHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case UpdateByInternalPath:
      return updateByInternalPathHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case FetchHeadOids:
      return fetchHeadOidsHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case UpdateBlobBuffer:
      return updateBlobBufferHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case FetchStageInfo:
      return fetchStageInfoHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case WritePersistedState:
      return writeStateHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case ReadPersistedState:
      return readStateHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case ParseMarkdown:
      return parseMarkdownHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case ClearStageData:
      return clearStageDataHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case RemoveAllRepositories:
      return removeAllRepositoriesHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    case InitializePersistedState:
      return initializePersistedStateHandler as Handler<
        RepositoryWorkerRequestActions,
        RepositoryWorkerResponseActions
      >;
    default:
      return null;
  }
}
