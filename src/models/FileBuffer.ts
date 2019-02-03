import { basename, extname, join } from 'path';
import uuid from 'uuid/v4'; // tslint:disable-line match-default-export-name
import {
  isArrayOf,
  isNonNullObject,
  isPropertyValidTypeOf,
} from '../core/utils/types';
import { Dependency, isDependency } from './DependencyTable';
import { Namespace } from './Namespace';
import {
  FileModes,
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
export type FileTypes =
  | typeof FileTypeDirectory
  | typeof FileTypeMarkdown
  | typeof FileTypeText
  | typeof FileTypeRaw
  | typeof FileTypeDoesNotExist
  | typeof FileTypeUnrendarableStatType;

export function isValidFileType(obj: unknown): obj is FileTypes {
  if (typeof obj !== 'string') {
    return false;
  }

  switch (obj) {
    case FileTypeDirectory:
    case FileTypeMarkdown:
    case FileTypeText:
    case FileTypeRaw:
    case FileTypeDoesNotExist:
    case FileTypeUnrendarableStatType:
      return true;
    default:
      return false;
  }
}

export type FileBufferId = string;

export type FileBuffer = {
  id: FileBufferId;
  namespace: string;
  path: string;
  fileType: FileTypes;
  content: string | Buffer | null;
  dependencies: Dependency;
  variables: any[];
};

export type SingleNamespaceFileBuffer<T> = FileBuffer & {
  namespace: T;
};

export function filterNamespace<N>(
  fileBuffer: SingleNamespaceFileBuffer<N>,
  fileBuffers: FileBuffer[],
): Array<SingleNamespaceFileBuffer<T>> {
  return fileBuffers.filter((item) => item.namespace === fileBuffer.namespace);
}

export function isFileBufferIds(obj: unknown): obj is FileBufferId[] {
  return isArrayOf(obj, (v: unknown): v is string => typeof v === 'string');
}

export function isFileBuffer(value: unknown): value is FileBuffer {
  if (!isNonNullObject(value)) {
    return false;
  }

  const obj = value as FileBuffer;

  if (!isPropertyValidTypeOf(obj, 'id', 'string')) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj, 'namespace', 'string')) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj, 'path', 'string')) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj, 'fileType', isValidFileType)) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj, 'dependencies', isDependency)) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj, 'variables', 'array')) {
    return false;
  }

  return true;
}

export function newFileBufferId(): FileBufferId {
  return uuid();
}

export function newFileBuffer(
  namespace: Namespace,
  [absolutePath, fileMode]: [string, FileModes],
  content: string | Buffer | null,
): FileBuffer {
  const name = basename(absolutePath);
  const path = toPath(namespace.loaderContext.path, absolutePath);

  const file: FileBuffer = {
    id: newFileBufferId(),
    namespace: namespace.name,
    path,
    fileType: detectType(fileMode, name),
    content,
    dependencies: {
      name: [],
      content: [],
    },
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

export function detectType(fileMode: FileModes, name: string): FileTypes {
  const type = statType(fileMode);
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

export function convertExt(fileType: FileTypes): string | Error {
  switch (fileType) {
    case FileTypeMarkdown:
      return '.html';
    case FileTypeText:
      return '.html';
    default:
      return new Error('');
  }
}

export function isWritableFileType(fileType: FileTypes): boolean {
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

export function fileBufferName(fileBuffer: FileBuffer): string {
  return basename(fileBuffer.path);
}
