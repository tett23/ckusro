import { RepoPath, InternalPath } from '@ckusro/ckusro-core';
import { GlobalBlobWriteInfo } from '@ckusro/ckusro-core/lib/src/models/GlobalWriteInfo';

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

export const FetchObjects = 'RepositoryWorker/FetchObjects' as const;

export function fetchObjects(oids: string[]) {
  return {
    type: FetchObjects,
    payload: oids,
  };
}

export const UpdateByInternalPath = 'RepositoryWorker/UpdateByInternalPath' as const;

export function updateByInternalPath(internalPath: InternalPath) {
  return {
    type: UpdateByInternalPath,
    payload: internalPath,
  };
}

export const FetchHeadOids = 'RepositoryWorker/FetchHeadOids' as const;

export function fetchHeadOids() {
  return {
    type: FetchHeadOids,
    payload: null,
  };
}

export const UpdateBlobBuffer = 'RepositoryWorker/UpdateBlobBuffer' as const;

export function updateBlobBuffer(writeInfo: GlobalBlobWriteInfo) {
  return {
    type: UpdateBlobBuffer,
    payload: writeInfo,
  };
}

export const FetchStageInfo = 'RepositoryWorker/FetchStageInfo' as const;

export function fetchStageInfo() {
  return {
    type: FetchStageInfo,
    payload: null,
  };
}

export const LsFiles = 'RepositoryWorker/LsFiles' as const;

export function lsFiles() {
  return {
    type: LsFiles,
    payload: null,
  };
}

export const ClearStageData = 'RepositoryWorker/ClearStageData' as const;

export function clearStageData() {
  return {
    type: ClearStageData,
    payload: null,
  };
}

export const RemoveAllRepositories = 'RepositoryWorker/RemoveAllRepositories' as const;

export function removeAllRepositories() {
  return {
    type: RemoveAllRepositories,
    payload: null,
  };
}

export const RemoveByInternalPath = 'RepositoryWorker/RemoveByInternalPath' as const;

export function removeByInternalPath(internalPath: InternalPath) {
  return {
    type: RemoveByInternalPath,
    payload: internalPath,
  };
}

export type RepositoryWorkerActions =
  | ReturnType<typeof cloneRepository>
  | ReturnType<typeof pullRepository>
  | ReturnType<typeof fetchObjects>
  | ReturnType<typeof updateByInternalPath>
  | ReturnType<typeof fetchHeadOids>
  | ReturnType<typeof updateBlobBuffer>
  | ReturnType<typeof fetchStageInfo>
  | ReturnType<typeof lsFiles>
  | ReturnType<typeof clearStageData>
  | ReturnType<typeof removeAllRepositories>
  | ReturnType<typeof removeByInternalPath>;
