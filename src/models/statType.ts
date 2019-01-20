import { S_IFMT } from 'constants';

export const StatTypeBlockDevice: 'StatType:BlockDevice' =
  'StatType:BlockDevice';
export const StatTypeCharacterDevice: 'StatType:CharacterDevice' =
  'StatType:CharacterDevice';
export const StatTypeDirectory: 'StatType:Directory' = 'StatType:Directory';
export const StatTypeFIFO: 'StatType:FIFO' = 'StatType:FIFO';
export const StatTypeFile: 'StatType:File' = 'StatType:File';
export const StatTypeSocket: 'StatType:Socket' = 'StatType:Socket';
export const StatTypeSymbolicLink: 'StatType:SymbolicLink' =
  'StatType:SymbolicLink';
export type StatTypes =
  | typeof StatTypeBlockDevice
  | typeof StatTypeCharacterDevice
  | typeof StatTypeDirectory
  | typeof StatTypeFIFO
  | typeof StatTypeFile
  | typeof StatTypeSocket
  | typeof StatTypeSymbolicLink;

const FileModeBlockDevice: 0o060000 = 0o060000; // S_IFBLK
const FileModeCharacterDevice: 0o020000 = 0o020000; // S_IFCHR
const FileModeDirectory: 0o040000 = 0o040000; // S_IFDIR
const FileModeFIFO: 0o010000 = 0o010000; // S_IFIFO
const FileModeFile: 0o100000 = 0o100000; // S_IFREG
const FileModeSocket: 0o140000 = 0o140000; // S_IFSOCK
const FileModeSymbolicLink: 0o120000 = 0o120000; // S_IFLNK

export type FileModes =
  | typeof FileModeBlockDevice
  | typeof FileModeCharacterDevice
  | typeof FileModeDirectory
  | typeof FileModeFIFO
  | typeof FileModeFile
  | typeof FileModeSocket
  | typeof FileModeSymbolicLink;

export function statType(mode: number): StatTypes {
  switch (
    S_IFMT & mode // tslint:disable-line no-bitwise
  ) {
    case FileModeBlockDevice:
      return StatTypeBlockDevice;
    case FileModeCharacterDevice:
      return StatTypeCharacterDevice;
    case FileModeDirectory:
      return StatTypeDirectory;
    case FileModeFIFO:
      return StatTypeFIFO;
    case FileModeFile:
      return StatTypeFile;
    case FileModeSocket:
      return StatTypeSocket;
    case FileModeSymbolicLink:
      return StatTypeSymbolicLink;
    default:
      throw new Error(`invalid stat mode ${mode}`);
  }
}
