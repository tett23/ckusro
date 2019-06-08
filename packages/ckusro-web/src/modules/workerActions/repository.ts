export const CloneRepository = 'RepositoryWorker/Clone' as const;

export function cloneRepository(url: string) {
  return {
    type: CloneRepository,
    payload: { url },
  };
}

export const FetchObject = 'RepositoryWorker/FetchObject' as const;

export function fetchObject(oid: string) {
  return {
    type: FetchObject,
    payload: oid,
  };
}

export const ErrorMessage = 'RepositoryWorker/ErrorMessage' as const;

export function errorMessage(err: Error) {
  return {
    type: ErrorMessage,
    payload: err.message,
  };
}

export type RepositoryWorkerActions =
  | ReturnType<typeof cloneRepository>
  | ReturnType<typeof errorMessage>
  | ReturnType<typeof fetchObject>;
