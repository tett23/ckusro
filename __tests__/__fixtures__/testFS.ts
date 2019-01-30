import {
  FS,
  FSCallback,
  PathLike,
  PromisifiedFS,
  Stats,
} from '../../src/core/types';
import {
  FileModeBlockDevice,
  FileModeCharacterDevice,
  FileModeDirectory,
  FileModeFIFO,
  FileModeFile,
  FileModes,
  FileModeSocket,
  FileModeSymbolicLink,
  StatTypeBlockDevice,
  StatTypeCharacterDevice,
  StatTypeDirectory,
  StatTypeFIFO,
  StatTypeFile,
  StatTypes,
  StatTypeSocket,
  StatTypeSymbolicLink,
} from '../../src/models/statType';

function getUid() {
  return process.getuid && process.getuid();
}

function getGid() {
  return process.getgid && process.getgid();
}

let inoCounter = 0;

function fileMode(statType: StatTypes): FileModes {
  switch (statType) {
    case StatTypeBlockDevice:
      return FileModeBlockDevice;
    case StatTypeCharacterDevice:
      return FileModeCharacterDevice;
    case StatTypeDirectory:
      return FileModeDirectory;
    case StatTypeFIFO:
      return FileModeFIFO;
    case StatTypeFile:
      return FileModeFile;
    case StatTypeSocket:
      return FileModeSocket;
    case StatTypeSymbolicLink:
      return FileModeSymbolicLink;
    default:
      throw new Error();
  }
}

export function statsFixture(
  statType: StatTypes,
  overrides: Partial<Stats> = {},
): Stats {
  const now = Date.now();
  const nowDate = new Date(now);

  const stats: Stats = {
    mode: fileMode(statType),
    size: 0,
    blocks: 0,
    dev: 8675309,
    nlink: 0,
    uid: getUid(),
    gid: getGid(),
    rdev: 0,
    blksize: 4096,
    ino: inoCounter++,
    atime: nowDate,
    mtime: nowDate,
    ctime: nowDate,
    birthtime: nowDate,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    isFile: jest.fn().mockReturnValue(statType === StatTypeFile),
    isDirectory: jest.fn().mockReturnValue(statType === StatTypeDirectory),
    isBlockDevice: jest.fn().mockReturnValue(statType === StatTypeBlockDevice),
    isCharacterDevice: jest
      .fn()
      .mockReturnValue(statType === StatTypeCharacterDevice),
    isSymbolicLink: jest
      .fn()
      .mockReturnValue(statType === StatTypeSymbolicLink),
    isFIFO: jest.fn().mockReturnValue(statType === StatTypeFIFO),
    isSocket: jest.fn().mockReturnValue(statType === StatTypeSocket),
  };

  return { ...stats, ...overrides };
}

export function testFS(overrides: Partial<FS> = {}): FS {
  const fs = {
    lstat: () =>
      jest
        .fn()
        .mockImplementation((_: PathLike, callback: FSCallback<Stats>) => {
          callback(null as any, statsFixture(StatTypeFile));
        }),
  };

  return { ...fs, ...overrides } as any;
}

export function promisifiedTestFS(
  overrides: Partial<PromisifiedFS> = {},
): PromisifiedFS {
  const fs = {
    lstat: jest.fn().mockResolvedValue(statsFixture(StatTypeFile)),
  };

  return { ...fs, ...overrides } as any;
}
