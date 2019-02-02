import { basename, extname } from 'path';
import uuid from 'uuid/v4'; // tslint:disable-line match-default-export-name
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
export type FileBufferId = string;

export type FileBuffer = {
  id: FileBufferId;
  namespace: string;
  path: string;
  fileType: FileTypes;
  content: string | Buffer | null;
  dependencies: {
    name: FileBufferId[];
    content: FileBufferId[];
  };
  variables: any[];
};

// export function isFileBuffer(obj: unknown): obj is FileBuffer {}

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
