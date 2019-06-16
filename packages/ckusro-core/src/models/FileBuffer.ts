import { TreeEntry } from './GitObject';
import { basename, InternalPath } from './InternalPath';

export type FileBuffer = {
  internalPath: InternalPath;
  content: BufferContent;
};

export const FileTypeDirectory = 'directory' as const;
export const FileTypeMarkdown = 'markdown' as const;
export const FileTypeText = 'text' as const;
export const FileTypeRaw = 'raw' as const;
export const FileTypeDoesNotExist = 'does_not_exist' as const;
export const FileTypeUnrendarableStatType = 'unrendarable_stat_type' as const;
export type FileTypes =
  | typeof FileTypeDirectory
  | typeof FileTypeMarkdown
  | typeof FileTypeText
  | typeof FileTypeRaw
  | typeof FileTypeDoesNotExist
  | typeof FileTypeUnrendarableStatType;

export type BufferContentDirectory = {
  type: typeof FileTypeDirectory;
  entries: TreeEntry[];
};

export type BufferContentMarkdown = {
  type: typeof FileTypeMarkdown;
  content: string;
};

export type BufferContentText = {
  type: typeof FileTypeText;
  content: string;
};

export type BufferContentRaw = {
  type: typeof FileTypeRaw;
  content: Buffer;
};

export type BufferContentDoesNotExist = {
  type: typeof FileTypeDoesNotExist;
};

export type BufferContentUnrenderableStatType = {
  type: typeof FileTypeUnrendarableStatType;
};

export type BufferContent =
  | BufferContentDirectory
  | BufferContentMarkdown
  | BufferContentText
  | BufferContentRaw
  | BufferContentDoesNotExist
  | BufferContentUnrenderableStatType;

export function fileBufferName(fileBuffer: FileBuffer): string {
  return basename(fileBuffer.internalPath);
}

export function newDoesNotExistFile(internalPath: InternalPath): FileBuffer {
  return {
    internalPath,
    content: {
      type: FileTypeDoesNotExist,
    },
  };
}
