import { RepoPath } from '@ckusro/ckusro-core';

export const CloneRepository = 'RepositoryWorker/Clone' as const;

export function cloneRepository(url: string) {
  return {
    type: CloneRepository,
    payload: { url },
  };
}

export const PullRepository = 'RepositoryWorker/PullRepository' as const;

export function pullRepository(repoPath: RepoPath) {
  return {
    type: PullRepository,
    payload: repoPath,
  };
}

export const FetchObject = 'RepositoryWorker/FetchObject' as const;

export function fetchObject(oid: string) {
  return {
    type: FetchObject,
    payload: oid,
  };
}

export const FetchHeadOids = 'RepositoryWorker/FetchHeadOids' as const;

export function fetchHeadOids() {
  return {
    type: FetchHeadOids,
    payload: null,
  };
}

export type RepositoryWorkerActions =
  | ReturnType<typeof cloneRepository>
  | ReturnType<typeof pullRepository>
  | ReturnType<typeof fetchObject>
  | ReturnType<typeof fetchHeadOids>;
