import { Actions } from '../modules';
import {
  CloneRepository,
  cloneRepository,
  RepositoryWorkerActions,
} from '../modules/workerActions/repository';

const WorkerResponseRepository = 'WorkerResponse/Repository' as const;

export type RepositoryWorkerResponse = WithRequestId<
  FSAction<Actions[] | null>
> & {
  type: typeof WorkerResponseRepository;
};

self.addEventListener('message', async (e) => {
  console.log(e);
  const action: WithRequestId<RepositoryWorkerActions> = e.data;

  const handler = actionHandler(action);
  const returnActions = handler == null ? null : await handler(action.payload);
  const response: RepositoryWorkerResponse = {
    type: WorkerResponseRepository,
    payload: returnActions,
    meta: {
      requestId: action.meta.requestId,
    },
  };

  (postMessage as any)(response);
});

export type Handler = (payload: any) => Promise<Actions[] | null>;
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
}: PayloadType<ReturnType<typeof cloneRepository>>): Promise<null> {
  console.log(url);

  return null;
}
