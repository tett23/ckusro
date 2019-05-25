export const CloneRepository = 'RepositoryWorker/Clone' as const;

export function cloneRepository(url: string) {
  return {
    type: CloneRepository,
    payload: { url },
  };
}

export type RepositoryWorkerActions = ReturnType<typeof cloneRepository>;
