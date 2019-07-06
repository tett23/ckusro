import { CkusroConfig } from '../models/CkusroConfig';
import {
  TreeObject,
  toTreeEntry,
  BlobObject,
  GitObjectTypes,
} from '../models/GitObject';
import { writeObject } from './writeObject';
import updateOrAppendTreeEntries from './updateOrAppendTreeEntries';

export type PathTreeObject = readonly [string, TreeObject];
export type PathTreeOrBlobObject = readonly [string, TreeObject | BlobObject];
export type LookupPathTreeObjectOrMixed<
  T extends GitObjectTypes
> = T extends 'tree'
  ? PathTreeObject
  : T extends 'blob'
  ? PathTreeOrBlobObject
  : never;

export default async function updateOrAppendObject<
  T extends PathTreeOrBlobObject
>(
  config: CkusroConfig,
  parents: PathTreeObject[],
  init: T,
): Promise<Array<LookupPathTreeObjectOrMixed<T[1]['type']>> | Error> {
  const result = await parents
    .reverse()
    .reduce(
      async (
        acc: Promise<PathTreeOrBlobObject[] | Error>,
        [parentPath, parentTree],
      ) => {
        const left = await acc;
        if (left instanceof Error) {
          return left;
        }

        const [[childPath, childTree]] = left;
        const newEntries = updateOrAppendTreeEntries(
          parentTree.content,
          toTreeEntry(childPath, childTree),
        );
        const isUpdated = parentTree.content !== newEntries;
        if (!isUpdated) {
          return left;
        }

        const newTree = await writeObject(config, {
          type: 'tree',
          content: newEntries,
        }).catch((err: Error) => err);
        if (newTree instanceof Error) {
          return newTree;
        }

        return [[parentPath, newTree] as const, ...left];
      },
      Promise.resolve([init]),
    );
  if (result instanceof Error) {
    return result;
  }

  return result as Array<LookupPathTreeObjectOrMixed<T[1]['type']>> | Error;
}
