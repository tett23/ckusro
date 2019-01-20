jest.mock('fs');

import fs from 'fs';
import {
  CkusroFile,
  convertExt,
  detectType,
  FileType,
  FileTypeDirectory,
  FileTypeDoesNotExist,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypeText,
  FileTypeUnrendarableStatType,
  isWritableFileType,
  newCkusroFile,
  newDoesNotExistFile,
  replaceExt,
  toPath,
} from '../../src/models/ckusroFile';
import {
  FileModeBlockDevice,
  FileModeDirectory,
  FileModeFile,
  FileModes,
} from '../../src/models/statType';
import { buildFile, buildLoaderContext } from '../__fixtures__';

describe(newCkusroFile, () => {
  it('return CkusroFile', async () => {
    // @ts-ignore
    fs.lstat.mockImplementation((path, callback) => {
      callback(null, {
        mode: FileModeFile,
      });
    });

    const context = buildLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    const actual = await newCkusroFile(context, '/test/ns/foo.md');
    const expected: Omit<
      CkusroFile,
      'id' | 'weakDependencies' | 'strongDependencies' | 'variables'
    > = {
      namespace: 'ns',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
    };

    expect(actual).toMatchObject(expected);
  });

  it('return Error when lstat raises Error', async () => {
    // @ts-ignore
    fs.lstat.mockImplementation((path, callback) => {
      callback(new Error(''));
    });

    const context = buildLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    const actual = await newCkusroFile(context, '/test/ns/foo.md');

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(toPath, () => {
  const data: Array<[string, string, string]> = [
    ['/foo', '/foo', '/'],
    ['/foo/', '/foo/', '/'],
    ['/foo', '/foo/bar', '/bar'],
    ['/foo/', '/foo/bar', '/bar'],
    ['/foo', '/foo/bar/', '/bar'],
  ];

  data.forEach(([contextPath, absolutePath, expected]) => {
    const actual = toPath(contextPath, absolutePath);

    expect(actual).toBe(expected);
  });
});

describe(detectType, () => {
  it('returns FileType', () => {
    const data: Array<[{ mode: FileModes }, string, FileType]> = [
      [{ mode: FileModeBlockDevice }, 'foo', FileTypeUnrendarableStatType],
      [{ mode: FileModeDirectory }, 'foo', FileTypeDirectory],
      [{ mode: FileModeFile }, 'foo', FileTypeRaw],
      [{ mode: FileModeFile }, 'foo.md', FileTypeMarkdown],
      [{ mode: FileModeFile }, 'foo.txt', FileTypeText],
      [{ mode: FileModeFile }, 'foo.unexpected_ext', FileTypeRaw],
    ];

    data.forEach(([stat, name, expected]) => {
      const actual = detectType(stat as any, name);

      expect(actual).toBe(expected);
    });
  });
});

describe(replaceExt, () => {
  it('replaces path', () => {
    const file = buildFile({ path: '/test.md', fileType: FileTypeMarkdown });
    const actual = replaceExt(file);

    expect(actual).toBe('/test.html');
  });

  it('do nothing when fileType is not markdown or txt', () => {
    const data: Array<[CkusroFile, string]> = [
      [buildFile({ fileType: FileTypeMarkdown, path: '/foo.md' }), '/foo.html'],
      [buildFile({ fileType: FileTypeText, path: '/foo.txt' }), '/foo.html'],
      [buildFile({ fileType: FileTypeDirectory, path: '/foo' }), '/foo'],
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

describe(newDoesNotExistFile, () => {
  const expected: CkusroFile = {
    id: 'test:/does_not_exist',
    namespace: 'test',
    name: 'does_not_exist',
    path: '/does_not_exist',
    fileType: FileTypeDoesNotExist,
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
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

describe(isWritableFileType, () => {
  it('', () => {
    const data: Array<[FileType, boolean]> = [
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
