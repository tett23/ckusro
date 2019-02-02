import {
  detectType,
  FileTypeDirectory,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypes,
  FileTypeText,
  FileTypeUnrendarableStatType,
  isFileBuffer,
  isFileBufferDependency,
  isFileBufferIds,
  toPath,
} from '../../src/models/FileBuffer';
import {
  FileModeBlockDevice,
  FileModeDirectory,
  FileModeFile,
  FileModes,
} from '../../src/models/StatType';
import '../__matchers__/toValidTypes';

describe(isFileBufferDependency, () => {
  it('judges types', () => {
    expect([
      [[{ name: [], content: [] }], true],
      [[{ name: [] }], false],
      [[{ content: [] }], false],
      [[{}], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[[]], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]).toValidatePair(isFileBufferDependency);
  });
});

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
      [
        [
          {
            id: '',
            namespace: '',
            path: '',
            fileType: FileTypeDirectory,
            content: '',
            dependencies: {
              name: [],
              content: [],
            },
            variables: [],
          },
        ],
        true,
      ],
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
