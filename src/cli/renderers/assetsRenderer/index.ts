import MemoryFileSystem from 'memory-fs';
import { join } from 'path';
import webpack from 'webpack';
import { separateErrors } from '../../../core/utils/errors';
import { isErrors } from '../../../core/utils/types';
import { assetsDirectory, GlobalState } from '../../../models/GlobalState';
import { WriteInfo } from '../../models/WriteInfo';
import config from './webpack.config';

export default async function assetsRenderer(
  globalState: GlobalState,
): Promise<WriteInfo[] | Error[]> {
  const fs = new MemoryFileSystem();
  const result = await jsAssets(fs);
  if (result instanceof Error) {
    return [result];
  }

  const entries = await fetchEntries(fs.readdir);
  if (entries instanceof Error) {
    return [entries];
  }

  const assetsDir = assetsDirectory(globalState);
  const [writeInfos, errors] = separateErrors(
    await buildWriteInfos(fs.readFile, entries, assetsDir),
  );
  if (isErrors(isErrors)) {
    return errors;
  }

  return writeInfos;
}

export function jsAssets(fs: MemoryFileSystem): Promise<true | Error> {
  const promise: Promise<true | Error> = new Promise((resolve) => {
    const compiler = webpack({
      ...config,
      mode: 'production',
      output: {
        path: '/',
      },
    });
    compiler.outputFileSystem = fs;

    compiler.run((err, stats) => {
      if (err != null) {
        resolve(err);
        return;
      }

      const info = stats.toJson();
      if (stats.hasWarnings()) {
        info.warnings.forEach((item: string) => console.info(item));
      }

      if (stats.hasErrors()) {
        info.errors.forEach((item: string) => console.info(item));
        resolve(new Error('webpack error.'));
      }

      resolve(true);
    });
  });

  return promise;
}

export async function buildWriteInfos(
  readFile: MemoryFileSystem['readFile'],
  entries: string[],
  assetsDir: string,
): Promise<Array<WriteInfo | Error>> {
  const ps = entries.map(
    (path): Promise<WriteInfo | Error> => {
      return new Promise((resolve) => {
        readFile(path, (err, result) => {
          if (err != null) {
            resolve(err);
            return;
          }

          const ret: WriteInfo = {
            path: join(assetsDir, path),
            content: result,
          };

          resolve(ret);
        });
      });
    },
  );

  return await Promise.all(ps);
}

export async function fetchEntries(
  readdir: MemoryFileSystem['readdir'],
): Promise<string[] | Error> {
  // FIXME: consider children directory
  const parentDir = '/';

  return await new Promise((resolve) => {
    readdir(parentDir, (err, result) => {
      if (err != null) {
        resolve(err);
        return;
      }

      const ret = result.map((item: string) => join(parentDir, item));

      resolve(ret);
    });
  }).catch((err) => err);
}
