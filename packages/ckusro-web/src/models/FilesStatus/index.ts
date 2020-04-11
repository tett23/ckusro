import { createInternalPath, InternalPath } from '@ckusro/ckusro-core';
import { PathManager } from '../PathManager';

export type MergedPathManagerFlags =
  | 'nochanged'
  | 'changed'
  | 'deleted'
  | 'added';

export type MergedPathManagerNoChangedItem = {
  internalPath: InternalPath;
  originalOid: string;
  changedOid: null;
  flag: 'nochanged';
};

export type MergedPathManagerChangedItemItem = {
  internalPath: InternalPath;
  originalOid: string;
  changedOid: string;
  flag: 'changed';
};

export type MergedPathManagerAddedItem = {
  internalPath: InternalPath;
  originalOid: null;
  changedOid: string;
  flag: 'added';
};

export type MergedPathManagerItem =
  | MergedPathManagerNoChangedItem
  | MergedPathManagerChangedItemItem
  | MergedPathManagerAddedItem;

export type MergedPathManager = MergedPathManagerItem[];

export function createFilesStatus(
  repoPathManager: PathManager,
  stagePathManager: PathManager,
): MergedPathManager {
  const tmp = transformObject(repoPathManager);
  const records = stagePathManager.reduce((acc, [internalPath, entry]) => {
    const fullPath = createInternalPath(internalPath).flat();
    const pathItem: MergedPathManagerItem | null = acc[fullPath];
    if (pathItem == null) {
      acc[fullPath] = {
        internalPath,
        originalOid: null,
        changedOid: entry.oid,
        flag: 'added',
      };

      return acc;
    }
    if (pathItem.originalOid === entry.oid) {
      return acc;
    }

    const newItem: MergedPathManagerChangedItemItem = {
      ...tmp[fullPath],
      changedOid: entry.oid,
      flag: 'changed',
    };
    acc[fullPath] = newItem;

    return acc;
  }, tmp as Record<string, MergedPathManagerItem>);

  return Object.values(records);
}

function transformObject(
  manager: PathManager,
): Record<string, MergedPathManagerNoChangedItem> {
  return manager.reduce(
    (acc: Record<string, MergedPathManagerItem>, [internalPath, entry]) => {
      const fullPath = createInternalPath(internalPath).flat();
      acc[fullPath] = {
        internalPath,
        originalOid: entry.oid,
        changedOid: null,
        flag: 'nochanged',
      };

      return acc;
    },
    {},
  );
}
