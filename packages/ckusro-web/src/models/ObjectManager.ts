import { GitObject } from '@ckusro/ckusro-core';

export type ObjectManager = {
  [oid: string]: GitObject;
};

export function createObjectManager(manager: ObjectManager) {
  return {
    addObject: (object: GitObject) => addObject(manager, object),
  };
}

export function addObject(manager: ObjectManager, object: GitObject) {
  return {
    ...manager,
    [object.oid]: object,
  };
}
