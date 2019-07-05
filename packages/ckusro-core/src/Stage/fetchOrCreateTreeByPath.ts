import { basename } from 'path';
import { CkusroConfig } from '../models/CkusroConfig';
import { fetchByPath } from './fetchByPath';
import { TreeObject } from '../models/GitObject';
import { writeObject } from './writeObject';
import splitPath from '../utils/splitPath';
import updateOrAppendObject, { PathTreeObject } from './updateOrAppendObject';

export async function fetchOrCreateTreeByPath(
  config: CkusroConfig,
  path: string,
) {
  const paths = splitPath(path);
  const result = paths.reduce(
    async (
      acc: Promise<PathTreeObject[] | Error>,
      path,
    ): Promise<PathTreeObject[] | Error> => {
      const left = await acc;
      if (left instanceof Error) {
        return left;
      }

      const fetchResult = await fetchByPath(config, path);
      if (fetchResult instanceof Error) {
        return fetchResult;
      }

      if (fetchResult != null) {
        return [...left, [basename(path), fetchResult as TreeObject] as const];
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
    Promise.resolve([]),
  );

  return result;
}
