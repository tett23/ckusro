import {
  GitObject,
  GitObjectTypes,
  isCommitObject,
  isTreeObject,
  isBlobObject,
  isTagObject,
  LookUpGitObjectType,
} from '@ckusro/ckusro-core';

export type ObjectManager = {
  [oid: string]: GitObject;
};

export function createObjectManager(manager: ObjectManager) {
  return {
    addObjects: (objects: GitObject[]) => addObjects(manager, objects),
    fetch: <N extends GitObjectTypes>(oid: string, type?: N) =>
      fetch(manager, oid, type),
    includes: (objects: GitObject[]) => includes(manager, objects),
    difference: (oids: string[]) => difference(manager, oids),
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

export function includes(
  manager: ObjectManager,
  gitObjects: GitObject[],
): boolean {
  return gitObjects.some(({ oid }) => manager[oid] != null);
}

type NameOrGitObject<
  N extends GitObjectTypes | undefined
> = N extends GitObjectTypes ? LookUpGitObjectType<N> : GitObject;

export function fetch<N extends GitObjectTypes | undefined>(
  manager: ObjectManager,
  oid: string,
  type?: N,
): NameOrGitObject<N> | null {
  const object: GitObject | null = manager[oid];
  if (object == null) {
    return null;
  }
  if (type == null) {
    return object as NameOrGitObject<N>;
  }

  switch (type) {
    case 'commit':
      return isCommitObject(object) ? (object as NameOrGitObject<N>) : null;
    case 'tree':
      return isTreeObject(object) ? (object as NameOrGitObject<N>) : null;
    case 'blob':
      return isBlobObject(object) ? (object as NameOrGitObject<N>) : null;
    case 'tag':
      return isTagObject(object) ? (object as NameOrGitObject<N>) : null;
    default:
      return null;
  }
}

export function difference(manager: ObjectManager, oids: string[]): string[] {
  const keys = Object.keys(manager);

  return oids.filter((item) => !keys.includes(item));
}
