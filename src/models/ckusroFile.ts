import { Stats } from 'fs';
import { basename, extname, join } from 'path';
import uuid from 'uuid/v4'; // tslint:disable-line match-default-export-name
import { FileBuffer } from './FileBuffer';
import { LoaderContext } from './loaderContext';
import {
  statType,
  StatTypeDirectory,
  StatTypeFile,
  StatTypes,
} from './StatType';

export const FileTypeDirectory: 'directory' = 'directory';
export const FileTypeMarkdown: 'markdown' = 'markdown';
export const FileTypeText: 'text' = 'text';
export const FileTypeRaw: 'raw' = 'raw';
export const FileTypeDoesNotExist: 'does_not_exist' = 'does_not_exist';
export const FileTypeUnrendarableStatType: 'unrendarable_stat_type' =
  'unrendarable_stat_type';
export type FileType =
  | typeof FileTypeDirectory
  | typeof FileTypeMarkdown
  | typeof FileTypeText
  | typeof FileTypeRaw
  | typeof FileTypeDoesNotExist
  | typeof FileTypeUnrendarableStatType;
export type CkusroId = string;

export type CkusroFile = {
  id: CkusroId;
  namespace: string;
  name: string;
  path: string;
  fileType: FileType;
  isLoaded: boolean;
  content: string | null;
  weakDependencies: CkusroId[];
  strongDependencies: CkusroId[];
  variables: any[];
};

export function newCkusroId(): CkusroId {
  return uuid();
}

export async function newCkusroFile(
  lstat: (path: string, options?: any) => Promise<Stats>,
  context: LoaderContext,
  absolutePath: string,
): Promise<CkusroFile | Error> {
  const stats = await lstat(absolutePath).catch((err: Error) => err);
  if (stats instanceof Error) {
    return stats;
  }

  const name = basename(absolutePath);
  const file: CkusroFile = {
    id: newCkusroId(),
    namespace: context.name,
    name,
    path: toPath(context.path, absolutePath),
    fileType: detectType(stats, name),
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };

  return file;
}

export function toPath(contextPath: string, absolutePath: string): string {
  const ret = absolutePath
    .replace(/\/$/, '')
    .slice(contextPath.replace(/\/$/, '').length);
  if (ret.length === 0) {
    return '/';
  }

  return ret;
}

const ValidStatTypes: StatTypes[] = [StatTypeFile, StatTypeDirectory];

export function detectType(stats: Stats, name: string): FileType {
  const type = statType(stats.mode);
  if (!ValidStatTypes.includes(type)) {
    return FileTypeUnrendarableStatType;
  }

  if (type === StatTypeDirectory) {
    return FileTypeDirectory;
  }

  switch (extname(name)) {
    case '.md':
      return FileTypeMarkdown;
    case '.txt':
      return FileTypeText;
    default:
      return FileTypeRaw;
  }
}

export function replaceExt({ fileType, path }: FileBuffer): string {
  const newExt = convertExt(fileType);
  if (newExt instanceof Error) {
    return path;
  }

  const ext = extname(path);
  const replaced = path.replace(ext, newExt);

  return replaced;
}

export function convertExt(fileType: FileType): string | Error {
  switch (fileType) {
    case FileTypeMarkdown:
      return '.html';
    case FileTypeText:
      return '.html';
    default:
      return new Error('');
  }
}

export function isWritableFileType(fileType: FileType): boolean {
  switch (fileType) {
    case FileTypeDirectory:
      return false;
    case FileTypeDoesNotExist:
      return false;
    case FileTypeMarkdown:
      return true;
    case FileTypeText:
      return true;
    case FileTypeRaw:
      return true;
    case FileTypeUnrendarableStatType:
      return false;
  }
}

export function newDoesNotExistFile(
  namespace: string,
  path: string,
): FileBuffer {
  const absolutePath = join('/', path);

  return {
    id: `${namespace}:${absolutePath}`,
    namespace,
    path: absolutePath,
    fileType: FileTypeDoesNotExist,
    content: null,
    dependencies: {
      name: [],
      content: [],
    },
    variables: [],
  };
}
