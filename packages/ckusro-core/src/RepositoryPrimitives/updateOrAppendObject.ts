import FS from 'fs';
import { toTreeEntry } from '../models/GitObject';
import { writeObject } from './writeObject';
import updateOrAppendTreeEntries from './updateOrAppendTreeEntries';
import { IsomorphicGitConfig } from '../models/IsomorphicGitConfig';
import {
  PathTreeOrBlobObject,
  PathTreeObject,
  LookupPathTreeObjectOrMixed,
} from '../models/PathTreeObject';

export default async function updateOrAppendObject<
  T extends PathTreeOrBlobObject
>(
  fs: typeof FS,
  config: IsomorphicGitConfig,
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

        const newTree = await writeObject(fs, config, {
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
