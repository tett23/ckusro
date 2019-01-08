import { FileTypeDirectory, FileType, FileTypeMarkdown, FileTypeText, FileTypeRaw } from "../models/ckusroFile";

export const StatTypeDirectory: 'directory' = 'directory';
export const StatTypeFile: 'file' = 'file';
export type StatType = typeof StatTypeDirectory | typeof StatTypeFile;

export type CkusroObject = {
  name: string;
  path: string;
  fileType: StatType;
  children: CkusroObject[];
};

export function detectType(statType: StatType, name: string): FileType{
  if (statType === StatTypeDirectory) {
    return FileTypeDirectory;
  }

  const tmp = name.split('.');
  const ext = tmp[tmp.length - 1];

  switch (ext) {
    case 'md':
      return FileTypeMarkdown;
    case 'txt':
      return FileTypeText;
    default:
      return FileTypeRaw;
  }
}