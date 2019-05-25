export function cloneRepository(url: string) {
  return {
    type: 'RepositoryWorker/Clone',
    payload: { url },
  };
}

export type RepositoryWorkerActions = ReturnType<typeof cloneRepository>;
