import {
  InternalPathEntry,
  createInternalPath,
  RepoPath,
  compareRepoPath,
  TreeEntry,
  InternalPath,
  compareInternalPath,
  InternalPathBlobEntry,
  InternalPathTreeEntry,
  isBlobEntry,
} from '@ckusro/ckusro-core';

export type PathManager = Array<InternalPathEntry | InternalPathBlobEntry>;
export type TreePathManager = InternalPathTreeEntry[];
export type BlobPathManager = InternalPathBlobEntry[];

export function createPathManager(manager: PathManager) {
  return {
    update: (entries: InternalPathEntry[]) =>
      updatePathManager(manager, entries),
    clear: () => clearPathManager(),
    fetch: (internalPath: InternalPath) => fetchEntry(manager, internalPath),
    filterRepository: (repoPath: RepoPath) =>
      filterRepository(manager, repoPath),
    filterBlob: () => filterBlob(manager),
    removeUnchanged: (repoPathManager: PathManager) =>
      removeUnchanged(manager, repoPathManager),
  };
}

function updatePathManager(
  manager: PathManager,
  entries: InternalPathEntry[],
): PathManager {
  const tmp: Record<string, InternalPathEntry> = manager.reduce(
    (acc: Record<string, InternalPathEntry>, item) => {
      acc[createInternalPath(item[0]).flat()] = item;

      return acc;
    },
    {},
  );

  entries.forEach(([internalPath, entry]) => {
    tmp[createInternalPath(internalPath).flat()] = [internalPath, entry];
  });

  return Object.values(tmp);
}

function clearPathManager(): PathManager {
  return [];
}

function fetchEntry(
  manager: PathManager,
  internalPath: InternalPath,
): TreeEntry | null {
  const result = manager.find(([item]) =>
    compareInternalPath(internalPath, item),
  );
  if (result == null) {
    return null;
  }

  return result[1];
}

function filterRepository(
  manager: PathManager,
  repoPath: RepoPath,
): PathManager {
  return manager.filter((item) => compareRepoPath(item[0].repoPath, repoPath));
}

function filterBlob(manager: PathManager): BlobPathManager {
  return manager.filter((item): item is InternalPathBlobEntry =>
    isBlobEntry(item[1]),
  );
}

function removeUnchanged(
  manager: PathManager,
  repoPathManager: PathManager,
): PathManager {
  return manager.filter(([stageInternalPath, { oid: stageOid }]) => {
    return !repoPathManager.some(
      ([repoInternalPath, { oid: repoOid }]) =>
        stageOid === repoOid &&
        compareInternalPath(stageInternalPath, repoInternalPath),
    );
  });
}
