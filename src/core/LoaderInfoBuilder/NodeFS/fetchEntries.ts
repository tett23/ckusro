import { join } from 'path';
import { separateErrors } from '../../../core/utils/errors';
import { LoaderConfig } from '../../../models/ckusroConfig/LoaderConfig';
import { LoaderContext } from '../../../models/loaderContext';
import { PromisifiedFS } from '../../types';
import { isErrors } from '../../utils/types';

export type FileInfo = [string, number];

export default async function fetchEntries(
  readdir: PromisifiedFS['readdir'],
  lstat: PromisifiedFS['lstat'],
  context: LoaderContext,
): Promise<FileInfo[] | Error[]> {
  const result = await readdirRecursive(readdir, lstat, context.path);
  const [items, errors] = separateErrors(result);
  if (isErrors(errors)) {
    return errors;
  }

  const statResult = await bindStat(lstat, items);
  const [fileInfos, statErrors] = separateErrors(statResult);
  if (isErrors(statErrors)) {
    return errors;
  }

  return filterFileInfo(fileInfos, context.loaderConfig);
}

export async function readdirRecursive(
  readdir: PromisifiedFS['readdir'],
  lstat: PromisifiedFS['lstat'],
  path: string,
): Promise<Array<string | Error>> {
  const entries = await readdir(path).catch((err: Error) => err);
  if (entries instanceof Error) {
    return [entries];
  }

  const ps = entries.map(async (entry) => {
    const itemPath = join(path, entry);

    const ret: Array<string | Error> = [itemPath];
    const stats = await lstat(itemPath);
    if (stats instanceof Error) {
      return [stats];
    }

    if (stats.isDirectory()) {
      const children = (await readdirRecursive(
        readdir,
        lstat,
        itemPath,
      )).flatMap((item) => item);

      return ret.concat(children);
    }

    return ret;
  });

  const aa = await Promise.all(ps);

  return aa.flatMap((item) => item);
}

export async function bindStat(
  lstat: PromisifiedFS['lstat'],
  items: string[],
): Promise<Array<FileInfo | Error>> {
  const ps = items.map(async (item) => {
    return await lstat(item)
      .then(
        (stat): FileInfo | Error =>
          stat instanceof Error ? stat : [item, stat.mode],
      )
      .catch((err: Error) => err);
  });

  return await Promise.all(ps);
}

export function filterFileInfo(
  fileInfos: FileInfo[],
  loaderConfig: LoaderConfig,
): FileInfo[] {
  return fileInfos
    .filter(([path]) => [loaderConfig.enable].some((re) => re.test(path)))
    .filter(([path]) => loaderConfig.ignore.every((re) => !re.test(path)));
}
