import { basename, extname } from 'path';
import uuid from 'uuid/v4'; // tslint:disable-line match-default-export-name
import {
  isArrayOf,
  isNonNullObject,
  isPropertyTypeOf,
  isPropertyValidTypeOf,
} from '../core/utils/types';
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
  dependencies: FileBufferDependency;
  variables: any[];
};

export type FileBufferDependency = {
  name: FileBufferId[];
  content: FileBufferId[];
};

export function isFileBufferDependency(
  obj: unknown,
): obj is FileBufferDependency {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (
    !isPropertyValidTypeOf(obj as FileBufferDependency, 'name', isFileBufferIds)
  ) {
    return false;
  }
  if (
    !isPropertyValidTypeOf(
      obj as FileBufferDependency,
      'content',
      isFileBufferIds,
    )
  ) {
    return false;
  }

  return true;
}

export function isFileBufferIds(obj: unknown): obj is FileBufferId[] {
  return isArrayOf(obj, (v: unknown): v is string => typeof v === 'string');
}

export function isFileBuffer(obj: unknown): obj is FileBuffer {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!isPropertyTypeOf(obj as FileBuffer, 'id', 'string')) {
    return false;
  }
  if (!isPropertyTypeOf(obj as FileBuffer, 'namespace', 'string')) {
    return false;
  }
  if (!isPropertyTypeOf(obj as FileBuffer, 'path', 'string')) {
    return false;
  }
  if (!isPropertyValidTypeOf(obj as FileBuffer, 'fileType', isValidFileType)) {
    return false;
  }
  if (
    !isPropertyValidTypeOf(
      obj as FileBuffer,
      'dependencies',
      isFileBufferDependency,
    )
  ) {
    return false;
  }
  if (!isPropertyTypeOf(obj as FileBuffer, 'variables', 'array')) {
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
