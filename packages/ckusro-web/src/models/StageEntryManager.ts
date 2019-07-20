import {
  TreeEntry,
  InternalPathEntry,
  createInternalPath,
  InternalPath,
  compareInternalPath,
  RepoPath,
  compareRepoPath,
} from '@ckusro/ckusro-core';

export type StageManager = {
  headOid: string | null;
  internalPathEntries: InternalPathEntry[];
};

export function createStageManager(manager: StageManager) {
  return {
    headOid: () => manager.headOid,
    pathEntries: () => manager.internalPathEntries,
    update: (items: InternalPathEntry[]) => update(manager, items),
    updateHeadOid: (oid: string) => updateHeadOid(manager, oid),
    fetch: (internalPath: InternalPath) => fetch(manager, internalPath),
    repositoryFiles: (repoPath: RepoPath) => repositoryFiles(manager, repoPath),
    filterBlob: () => filterBlob(manager),
  };
}

export function updateHeadOid(
  manager: StageManager,
  headOid: string,
): StageManager {
  const ret: StageManager = {
    ...manager,
    internalPathEntries: [...manager.internalPathEntries],
  };

  ret.headOid = headOid;

  return ret;
}

export function update(
  manager: StageManager,
  items: InternalPathEntry[],
): StageManager {
  const ret: StageManager = {
    ...manager,
  };

  const tmp = [...manager.internalPathEntries, ...items].reduce(
    (acc: Record<string, InternalPathEntry>, item) => {
      acc[createInternalPath(item[0]).flat()] = item;

      return acc;
    },
    {},
  );

  ret.internalPathEntries = Object.values(tmp);

  return ret;
}

export function fetch(
  manager: StageManager,
  internalPath: InternalPath,
): TreeEntry | null {
  const result = manager.internalPathEntries.find(([item]) =>
    compareInternalPath(internalPath, item),
  );
  if (result == null) {
    return null;
  }

  return result[1];
}

export function repositoryFiles(
  manager: StageManager,
  repoPath: RepoPath,
): InternalPathEntry[] {
  return manager.internalPathEntries.filter((item) =>
    compareRepoPath(item[0].repoPath, repoPath),
  );
}

export function filterBlob(manager: StageManager): InternalPathEntry[] {
  return manager.internalPathEntries.filter((item) => item[1].type === 'blob');
}
