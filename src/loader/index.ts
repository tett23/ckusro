import fs from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

export const StatTypeDirectory: 'directory' = 'directory';
export const StatTypeFile: 'file' = 'file';
export type StatType = typeof StatTypeDirectory | typeof StatTypeFile;

export type CkusroObject = {
  name: string;
  fileType: StatType;
  children: CkusroObject[];
};

async function tree(path: string, extensions: RegExp): Promise<CkusroObject | null> {
  const res = await stat(path).catch(() => null);
  if (res == null) {
    return null;
  }
  if (res.isFile()) {
    if (!extensions.test(path)) {
      return null;
    }

    return {
      name: basename(path),
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

  const children = (await Promise.all(entries.map((item) => tree(`${path}/${item}`, extensions)))).filter(
    Boolean,
  ) as CkusroObject[];

  const ret: CkusroObject = {
    name: basename(path),
    fileType: StatTypeDirectory,
    children,
  };

  return ret;
}

export async function load(targetDirectory: string, extensions: RegExp): Promise<CkusroObject | null> {
  return await tree(targetDirectory, extensions);
}
