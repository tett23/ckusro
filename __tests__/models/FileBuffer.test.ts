import { FileTypeDirectory } from '../../src/models/CkusroFile';
import {
  detectType,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypes,
  FileTypeText,
  FileTypeUnrendarableStatType,
  toPath,
} from '../../src/models/FileBuffer';
import {
  FileModeBlockDevice,
  FileModeDirectory,
  FileModeFile,
  FileModes,
} from '../../src/models/StatType';

describe(toPath, () => {
  it('returns string', () => {
    const data: Array<[[string, string], string]> = [
      [['/foo', '/foo'], '/'],
      [['/foo/', '/foo/'], '/'],
      [['/foo', '/foo/bar'], '/bar'],
      [['/foo/', '/foo/bar'], '/bar'],
      [['/foo', '/foo/bar/'], '/bar'],
    ];

    data.forEach(([args, expected]) => {
      const actual = toPath(...args);

      expect(actual).toBe(expected);
    });
  });
});

describe(detectType, () => {
  it('returns FileType', () => {
    const data: Array<[[FileModes, string], FileTypes]> = [
      [[FileModeBlockDevice, 'foo'], FileTypeUnrendarableStatType],
      [[FileModeDirectory, 'foo'], FileTypeDirectory],
      [[FileModeFile, 'foo'], FileTypeRaw],
      [[FileModeFile, 'foo.md'], FileTypeMarkdown],
      [[FileModeFile, 'foo.txt'], FileTypeText],
      [[FileModeFile, 'foo.unexpected_ext'], FileTypeRaw],
    ];

    data.forEach(([args, expected]) => {
      const actual = detectType(...args);

      expect(actual).toBe(expected);
    });
  });
});
