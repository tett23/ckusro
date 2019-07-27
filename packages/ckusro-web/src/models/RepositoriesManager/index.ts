import { ObjectManager } from '../ObjectManager';
import { InternalPath } from '@ckusro/ckusro-core';
import {
  RefManager,
  emptyRefManager,
  createRefManager,
  Ref,
} from '../RefManager';
import { serialize } from './serialize';

export type PathManager = Array<[InternalPath, string]>;

export type RepositoriesManager = {
  objectManager: ObjectManager;
  stageHead: string | null;
  stagePathManager: PathManager;
  repositoryPathManager: PathManager;
  refManager: RefManager;
};

export function emptyRepositoriesManager(): RepositoriesManager {
  return {
    objectManager: {
      originalObjects: {},
    },
    stageHead: null,
    stagePathManager: [],
    repositoryPathManager: [],
    refManager: emptyRefManager(),
  };
}

export function createRepositoriesManager(manager: RepositoriesManager) {
  return {
    addRef: (ref: Ref) => ({
      ...manager,
      refManager: createRefManager(manager.refManager).addRef(ref),
    }),
    serialize: () => serialize(manager),
  };
}
