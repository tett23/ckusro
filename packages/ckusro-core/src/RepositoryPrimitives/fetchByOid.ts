import FS from 'fs';
import * as Git from 'isomorphic-git';
import {
  GitObjectTypes,
  LookUpGitObjectType,
  GitObject,
} from '../models/GitObject';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';

export default async function fetchByOid<T extends GitObjectTypes>(
  fs: typeof FS,
  config: IsomorphicGitConfig,
  oid: string,
  objectType?: T,
): Promise<LookUpGitObjectType<T> | null | Error> {
  const objectDescription = await Git.readObject({
    ...config,
    fs,
    oid,
  }).catch((err: Error) => err);
  if (objectDescription instanceof Error) {
    if (objectDescription.name === 'NotFoundError') {
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

  if (type === 'deflated' || type === 'wrapped') {
    return new Error(`Unexpected object type. type=${type}`);
  }

  return toGitObject(oid, type, object) as LookUpGitObjectType<T>;
}

function toGitObject(
  oid: string,
  type: GitObjectTypes,
  object:
    | string
    | Uint8Array
    | Git.CommitObject
    | Git.TreeObject
    | Git.TagObject,
): GitObject {
  switch (type) {
    case 'commit':
      return {
        oid,
        type: 'commit',
        content: object as Git.CommitObject,
      };
    case 'tree':
      return {
        oid,
        type: 'tree',
        content: object as Git.TreeObject,
      };
    case 'blob':
      if (!(typeof object === 'string' || object instanceof Uint8Array)) {
        throw new Error('Invalid blob format');
      }

      return {
        oid,
        type: 'blob',
        content: Buffer.from(object as string | Uint8Array),
      };
    case 'tag':
      return { oid, type: 'tag', content: object as Git.TagObject };
    default:
      throw new Error('Invalid object type');
  }
}
