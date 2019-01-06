export const StatTypeDirectory: 'directory' = 'directory';
export const StatTypeFile: 'file' = 'file';
export type StatType = typeof StatTypeDirectory | typeof StatTypeFile;

export type CkusroObject = {
  name: string;
  path: string;
  fileType: StatType;
  children: CkusroObject[];
};
