import {
  ObjectManager,
  createObjectManager,
  createEmptyObjectManager,
} from '../ObjectManager';
import { InternalPathEntry, GitObject } from '@ckusro/ckusro-core';
import {
  RefManager,
  emptyRefManager,
  createRefManager,
  Ref,
} from '../RefManager';
import serializeRepositoriesManager from './serialize';
import { createPathManager, PathManager } from '../PathManager';

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
    updateStageHead: (stageHead: string | null) => ({
      ...manager,
      stageHead,
    }),
    updateStageEntries: (entries: InternalPathEntry[]) => ({
      ...manager,
      stagePathManager: createPathManager(manager.stagePathManager).update(
        entries,
      ),
    }),
    clearStageManager: () => ({
      ...manager,
      stagePathManager: createPathManager(manager.stagePathManager).clear(),
    }),
    serialize: () => serializeRepositoriesManager(manager),
  };
}
