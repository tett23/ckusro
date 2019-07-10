import { basename } from 'path';
import { fetchByPath } from '../fetchByPath';
import { TreeObject, isTreeObject } from '../../models/GitObject';
import { writeObject } from '../writeObject';
import updateOrAppendObject from '../updateOrAppendObject';
import { PathTreeObject } from '../../models/PathTreeObject';
import { IsomorphicGitConfig } from '../../models/IsomorphicGitConfig';
import splitPath from '../../utils/splitPath';
import normalizePath from '../../utils/normalizePath';

type FetchParentsOptions = {
  create: boolean;
};

const DefaultOptions = {
  create: false,
};

export default async function fetchParents(
  config: IsomorphicGitConfig,
  root: TreeObject,
  path: string,
  options?: Partial<FetchParentsOptions>,
): Promise<PathTreeObject[] | Error> {
  const opts = {
    ...DefaultOptions,
    ...(options || {}),
  };
  const paths = splitPath(normalizePath(path));
  const parentPaths = paths.slice(1, -1);
  const init = [['', root] as const];
  if (parentPaths.length === 0) {
    return init;
  }

  return parentPaths.reduce(
    async (
      acc: Promise<PathTreeObject[] | Error>,
      path,
    ): Promise<PathTreeObject[] | Error> => {
      const left = await acc;
      if (left instanceof Error) {
        return left;
      }

      const [[, parent]] = left;
      if (!isTreeObject(parent)) {
        return new Error('');
      }

      const fetchResult = await fetchByPath(config, parent, path);
      if (fetchResult instanceof Error) {
        return fetchResult;
      }
      if (fetchResult != null) {
        return [...left, [basename(path), fetchResult as TreeObject] as const];
      }
      if (!opts.create) {
        return new Error('');
      }

      const writeResult = await writeObject(config, {
        type: 'tree',
        content: [],
      });
      if (writeResult instanceof Error) {
        return writeResult;
      }

      return updateOrAppendObject(config, left, [basename(path), writeResult]);
    },
    Promise.resolve(init),
  );
}
