import { GitObject } from '@ckusro/ckusro-core';

export type ObjectManager = {
  [oid: string]: GitObject;
};

export function createObjectManager(manager: ObjectManager) {
  return {
    addObjects: (objects: GitObject[]) => addObjects(manager, objects),
    fetch: <T extends GitObject>(oid: string) => fetch<T>(manager, oid),
  };
}

export function addObjects(
  manager: ObjectManager,
  objects: GitObject[],
): ObjectManager {
  const ret = {
    ...manager,
  };

  objects.forEach((item) => {
    ret[item.oid] = item;
  });

  return ret;
}

export function fetch<T extends GitObject>(
  manager: ObjectManager,
  oid: string,
): T | null {
  const object: GitObject | null = manager[oid];
  if (object == null) {
    return null;
  }

  return object as T;
}
