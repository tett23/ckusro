import {
  convertExt,
  detectType,
  FileBuffer,
  FileTypeDirectory,
  FileTypeDoesNotExist,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypes,
  FileTypeText,
  FileTypeUnrendarableStatType,
  isFileBuffer,
  isFileBufferIds,
  isWritableFileType,
  newDoesNotExistFile,
  replaceExt,
  toPath,
} from '../../src/models/FileBuffer';
import {
  FileModeBlockDevice,
  FileModeDirectory,
  FileModeFile,
  FileModes,
} from '../../src/models/StatType';
import { buildFileBuffer } from '../__fixtures__';
import '../__matchers__/toValidTypes';

describe(isFileBufferIds, () => {
  it('judges types', () => {
    expect([
      [[[]], true],
      [[['test']], true],
      [[[1]], false],
      [[['test', 1]], false],
      [[{}], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]).toValidatePair(isFileBufferIds);
  });
});

describe(isFileBuffer, () => {
  it('judges types', () => {
    expect([
      [[buildFileBuffer()], true],
      [[{}], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]).toValidatePair(isFileBuffer);
  });
});

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

describe(replaceExt, () => {
  it('replaces path', () => {
    const file = buildFileBuffer({
      path: '/test.md',
      fileType: FileTypeMarkdown,
    });
    const actual = replaceExt(file);

    expect(actual).toBe('/test.html');
  });

  it('do nothing when fileType is not markdown or txt', () => {
    const data: Array<[FileBuffer, string]> = [
      [
        buildFileBuffer({ fileType: FileTypeMarkdown, path: '/foo.md' }),
        '/foo.html',
      ],
      [
        buildFileBuffer({ fileType: FileTypeText, path: '/foo.txt' }),
        '/foo.html',
      ],
      [buildFileBuffer({ fileType: FileTypeDirectory, path: '/foo' }), '/foo'],
    ];
    data.forEach(([file, expected]) => {
      const actual = replaceExt(file);

      expect(actual).toBe(expected);
    });
  });
});

describe(convertExt, () => {
  it('returns string when FileType is valid', () => {
    const actual = convertExt(FileTypeMarkdown);

    expect(actual).toBe('.html');
  });

  it('returns Error when FileType is invalid', () => {
    const actual = convertExt(FileTypeDirectory);

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(isWritableFileType, () => {
  it('', () => {
    const data: Array<[FileTypes, boolean]> = [
      [FileTypeDirectory, false],
      [FileTypeDoesNotExist, false],
      [FileTypeMarkdown, true],
      [FileTypeText, true],
      [FileTypeRaw, true],
    ];

    data.forEach((item) => {
      const [value, expected] = item;
      const actual = isWritableFileType(value);

      expect(actual).toEqual(expected);
    });
  });
});

describe(newDoesNotExistFile, () => {
  const expected: FileBuffer = {
    id: 'test:/does_not_exist',
    namespace: 'test',
    path: '/does_not_exist',
    fileType: FileTypeDoesNotExist,
    content: null,
    dependencies: {
      name: [],
      content: [],
    },
    variables: [],
  };

  it('returns FileTypeDoesNotExist object', () => {
    const actual = newDoesNotExistFile('test', '/does_not_exist');

    expect(actual).toEqual(expected);
  });

  it('transforms path into absolute path', () => {
    const actual = newDoesNotExistFile('test', 'does_not_exist');

    expect(actual).toEqual(expected);
  });
});
