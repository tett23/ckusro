import { join, basename } from 'path';
import { CkusroConfig } from '../models/CkusroConfig';
import { fetchByPath } from './fetchByPath';
import { TreeObject, TreeEntry, compareTreeEntry } from '../models/GitObject';
import { writeObject } from './writeObject';
import normalizePath from '../utils/normalizePath';

export type PathTreeObject = readonly [string, TreeObject];

export async function fetchOrCreateTreeByPath(
  config: CkusroConfig,
  path: string,
) {
  const paths = normalizePath(path)
    .split('/')
    .slice(1)
    .filter((item) => item.length !== 0)
    .reduce(
      (acc: string[], item) => {
        acc.push(join('/', ...acc.slice(-1), item));

        return acc;
      },
      ['/'],
    );

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

      return updateOrAppendTreeEntry(config, left, [
        basename(path),
        writeResult,
      ]);
    },
    Promise.resolve([]),
  );

  return result;
}

export async function updateOrAppendTreeEntry(
  config: CkusroConfig,
  parents: PathTreeObject[],
  init: PathTreeObject,
): Promise<PathTreeObject[] | Error> {
  const result = await parents
    .reverse()
    .reduce(
      async (
        acc: Promise<PathTreeObject[] | Error>,
        [parentPath, parentTree],
      ) => {
        const left = await acc;
        if (left instanceof Error) {
          return left;
        }

        const [[childPath, childTree]] = left.slice(-1);
        const newEntries = appendOrUpdate(parentTree.content, {
          type: 'tree',
          oid: childTree.oid,
          mode: '100644',
          path: childPath,
        });
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

        return [...left, [parentPath, newTree] as const];
      },
      Promise.resolve([init]),
    );
  if (result instanceof Error) {
    return result;
  }

  return result;
}

export function appendOrUpdate(
  entries: TreeEntry[],
  entry: TreeEntry,
): TreeEntry[] {
  const idx = entries.findIndex((item) => item.path === entry.path);
  if (idx === -1) {
    return [...entries, entry];
  }

  if (compareTreeEntry(entries[idx], entry)) {
    return entries;
  }

  return [...entries.slice(0, idx), entry, ...entries.slice(idx + 1)];
}
