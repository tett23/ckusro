import * as Git from 'isomorphic-git';
import { CkusroConfig } from '../models/CkusroConfig';
import { GitObject } from '../models/GitObject';

export async function fetchByOid(
  config: CkusroConfig,
  oid: string,
): Promise<GitObject | null | Error> {
  const objectDescription = await Git.readObject({
    core: config.coreId,
    gitdir: config.stage,
    oid,
  }).catch((err: Error) => err);
  if (objectDescription instanceof Error) {
    if (objectDescription.name === 'ReadObjectFail') {
      return null;
    }

    return objectDescription;
  }

  const { type, object } = objectDescription;
  switch (type) {
    case 'commit':
      return { oid, type: 'commit', content: object as Git.CommitDescription };
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
    default:
      return new Error('Invalid object type.');
  }
}
