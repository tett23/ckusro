import {
  CkusroFile,
  convertExt,
  FileTypeDirectory,
  FileTypeDoesNotExist,
  FileTypeMarkdown,
  FileTypeText,
  newDoesNotExistFile,
  replaceExt,
} from '../../src/models/ckusroFile';
import { buildFile } from '../__fixtures__';

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
