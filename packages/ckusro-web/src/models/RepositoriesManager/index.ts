import {
  ObjectManager,
  createObjectManager,
  createEmptyObjectManager,
} from '../ObjectManager';
import {
  InternalPathEntry,
  GitObject,
  RepoPath,
  compareRepoPath,
  compareInternalPath,
  InternalPath,
  TreeEntry,
} from '@ckusro/ckusro-core';
import {
  RefManager,
  emptyRefManager,
  createRefManager,
  Ref,
} from '../RefManager';
import serializeRepositoriesManager from './serialize';
import { createPathManager, PathManager } from '../PathManager';
import { createFilesStatus } from '../FilesStatus';

export type RepositoriesManager = {
  objectManager: ObjectManager;
  stageHead: string | null;
  stagePathManager: PathManager;
  repositoryPathManager: PathManager;
  refManager: RefManager;
};

export function emptyRepositoriesManager(): RepositoriesManager {
  return {
    objectManager: createEmptyObjectManager(),
    stageHead: null,
    stagePathManager: [],
    repositoryPathManager: [],
    refManager: emptyRefManager(),
  };
}

export function createRepositoriesManager(manager: RepositoriesManager) {
  return {
    addObjects: (objects: GitObject[]) => ({
      ...manager,
      objectManager: createObjectManager(manager.objectManager).addObjects(
        objects,
      ),
    }),
    addRef: (ref: Ref) => ({
      ...manager,
      refManager: createRefManager(manager.refManager).addRef(ref),
    }),
    updateRepositoryPaths: (paths: InternalPathEntry[]) => ({
      ...manager,
      repositoryPathManager: createPathManager(
        manager.repositoryPathManager,
      ).update(paths),
    }),
    updateStageHead: (stageHead: string | null) => ({
      ...manager,
      stageHead,
    }),
    updateStagePaths: (paths: InternalPathEntry[]) => ({
      ...manager,
      stagePathManager: createPathManager(manager.stagePathManager).update(
        paths,
      ),
    }),
    clearStageManager: () => ({
      ...manager,
      stagePathManager: createPathManager(manager.stagePathManager).clear(),
    }),
    currentTree: (repoPath: RepoPath) =>
      createFilesStatus(
        manager.repositoryPathManager,
        manager.stagePathManager,
      ).filter((item) => compareRepoPath(repoPath, item.internalPath.repoPath)),
    entryStatus: (internalPath: InternalPath) => {
      const item = createFilesStatus(
        manager.repositoryPathManager,
        manager.stagePathManager,
      ).find((item) => compareInternalPath(internalPath, item.internalPath));

      return item || null;
    },
    fetchCurrentTreeEntries: (internalPath: InternalPath) => {
      const originalEntry = createPathManager(
        manager.repositoryPathManager,
      ).fetch(internalPath);
      const stageEntry = createPathManager(manager.stagePathManager).fetch(
        internalPath,
      );
      const originalOid = originalEntry == null ? null : originalEntry.oid;
      const stageOid = stageEntry == null ? null : stageEntry.oid;
      const objectManager = createObjectManager(manager.objectManager);
      const originalTree =
        originalOid == null ? null : objectManager.fetch(originalOid, 'tree');
      const stageTree =
        stageOid == null ? null : objectManager.fetch(stageOid, 'tree');

      const originalEntries = (originalTree == null
        ? []
        : originalTree.content
      ).reduce<Record<string, TreeEntry>>((acc, item) => {
        acc[item.path] = item;

        return acc;
      }, {});
      const merged = (stageTree == null ? [] : stageTree.content).reduce<
        Record<string, TreeEntry>
      >((acc, item) => {
        acc[item.path] = item;

        return acc;
      }, originalEntries);

      return Object.values(merged);
    },
    serialize: () => serializeRepositoriesManager(manager),
  };
}
