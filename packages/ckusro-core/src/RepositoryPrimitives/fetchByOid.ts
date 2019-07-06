import * as Git from 'isomorphic-git';
import {
  GitObjectTypes,
  LookUpGitObjectType,
  GitObject,
} from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export async function fetchByOid<T extends GitObjectTypes>(
  config: IsomorphicGitConfig,
  oid: string,
  objectType?: T,
): Promise<LookUpGitObjectType<T> | null | Error> {
  const objectDescription = await Git.readObject({
    ...config,
    oid,
  }).catch((err: Error) => err);
  if (objectDescription instanceof Error) {
    if (objectDescription.name === 'ReadObjectFail') {
      return null;
    }

    return objectDescription;
  }

  const { type, object } = objectDescription;
  if (type == null) {
    return new Error('Invalid object type.');
  }
  if (objectType != null && type !== objectType) {
    return new Error(
      `Object type does not matched. expected=${objectType} actual=${type}`,
    );
  }

  return toGitObject(oid, type, object) as LookUpGitObjectType<T>;
}

function toGitObject(
  oid: string,
  type: GitObjectTypes,
  object:
    | Buffer
    | Git.CommitDescription
    | Git.TreeDescription
    | Git.TagDescription,
): GitObject {
  switch (type) {
    case 'commit':
      return {
        oid,
        type: 'commit',
        content: object as Git.CommitDescription,
      };
    case 'tree':
      return {
        oid,
        type: 'tree',
        content: (object as Git.TreeDescription).entries,
      };
    case 'blob':
      return { oid, type: 'blob', content: object as Buffer };
    case 'tag':
      return { oid, type: 'tag', content: object as Git.TagDescription };
  }
}
