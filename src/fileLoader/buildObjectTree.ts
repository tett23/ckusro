import fs from 'fs';
import { basename, join } from 'path';
import { promisify } from 'util';
import { LoaderConfig } from '../models/ckusroConfig/LoaderConfig';
import { CkusroObject, StatTypeDirectory, StatTypeFile } from './ckusroObject';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

export async function buildObjectTree(
  path: string,
  loaderConfig: LoaderConfig,
  basePath: string,
): Promise<CkusroObject | null> {
  const isIgnoreItem = loaderConfig.ignore.some((re) => re.test(path));
  if (isIgnoreItem) {
    return null;
  }

  const res = await stat(path).catch(() => null);
  if (res == null) {
    return null;
  }

  const itemPath = join('/', path.slice(basePath.length));

  if (res.isFile()) {
    if (!loaderConfig.extensions.test(path)) {
      return null;
    }

    return {
      name: basename(path),
      path: itemPath,
      fileType: StatTypeFile,
      children: [],
    };
  }
  if (!res.isDirectory()) {
    return null;
  }

  const entries = await readdir(path).catch(() => null);
  if (entries == null) {
    return null;
  }

  const children = (await Promise.all(
    entries.map((item) =>
      buildObjectTree(`${path}/${item}`, loaderConfig, basePath),
    ),
  )).filter(Boolean) as CkusroObject[];

  const ret: CkusroObject = {
    name: basename(path),
    path: itemPath,
    fileType: StatTypeDirectory,
    children,
  };

  return ret;
}
