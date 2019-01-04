import { basename, extname, join } from 'path';

export const FileTypeDirectory: 'directory' = 'directory';
export const FileTypeMarkdown: 'markdown' = 'markdown';
export const FileTypeText: 'text' = 'text';
export const FileTypeRaw: 'raw' = 'raw';
export const FileTypeDoesNotExist: 'does_not_exist' = 'does_not_exist';
export type FileType =
  | typeof FileTypeDirectory
  | typeof FileTypeMarkdown
  | typeof FileTypeText
  | typeof FileTypeRaw
  | typeof FileTypeDoesNotExist;
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

export function replaceExt(file: CkusroFile): string {
  const ext = extname(file.path);
  const replaced = file.path.replace(ext, convertExt(file.fileType));

  return replaced;
}

export function convertExt(fileType: FileType): string {
  switch (fileType) {
    case FileTypeMarkdown:
      return '.html';
    case FileTypeText:
      return '.html';
    default:
      throw new Error('');
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
  }
}

export function newDoesNotExistFile(
  namespace: string,
  path: string,
): CkusroFile {
  const absolutePath = join('/', path);

  return {
    id: `${namespace}:${absolutePath}`,
    namespace,
    name: basename(path),
    path: absolutePath,
    fileType: FileTypeDoesNotExist,
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };
}
