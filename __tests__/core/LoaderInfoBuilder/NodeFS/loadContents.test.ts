import { FileInfo } from '../../../../src/core/LoaderInfoBuilder/NodeFS/fetchEntries';
import loadContents, {
  loadEachItem,
} from '../../../../src/core/LoaderInfoBuilder/NodeFS/loadContents';
import {
  FileModeDirectory,
  FileModeFile,
} from '../../../../src/models/StatType';
import { UnloadedFile } from '../../../../src/models/UnloadedFile';
import {
  buildLocalLoaderContext,
  buildUnloadedFile,
} from '../../../__fixtures__';

describe(loadContents, () => {
  it('returns UnloadedFile-string tuples', async () => {
    const readFile = jest.fn().mockResolvedValueOnce('# test Markdown');
    const loaderContext = buildLocalLoaderContext();
    const entries: FileInfo[] = [
      ['/test.md', FileModeFile],
      ['/test', FileModeDirectory],
    ];
    const actual = await loadContents(readFile, loaderContext, entries);
    const expected: Array<[UnloadedFile, string | Buffer | null]> | Error[] = [
      [
        buildUnloadedFile({
          loaderContext,
          absolutePath: '/test.md',
          mode: FileModeFile,
        }),
        '# test Markdown',
      ],
      [
        buildUnloadedFile({
          loaderContext,
          absolutePath: '/test',
          mode: FileModeDirectory,
        }),
        null,
      ],
    ];

    expect(actual).toEqual(expected);
  });

  it('returns Errro[] when loadEachItem threw Error', async () => {
    const err = new Error();
    const readFile = jest.fn().mockRejectedValue(err);
    const loaderContext = buildLocalLoaderContext();
    const entries: FileInfo[] = [['/test.md', FileModeFile]];
    const actual = await loadContents(readFile, loaderContext, entries);

    expect(actual).toEqual([err]);
  });
});

describe(loadEachItem, () => {
  it('returns UnloadedFile-string tuple', async () => {
    const readFile = jest.fn().mockRejectedValue('# test Markdown');
    const loaderContext = buildLocalLoaderContext();
    const fileInfo: FileInfo = ['/test.md', FileModeFile];
    const actual = await loadEachItem(readFile, loaderContext, fileInfo);
    const expected = [
      buildUnloadedFile({ loaderContext, absolutePath: '/test.md' }),
      '# test Markdown',
    ];

    expect(actual).toEqual(expected);
  });
  it('returns Error when readFile threw Error', async () => {
    const readFile = jest.fn().mockRejectedValue(new Error());
    const loaderContext = buildLocalLoaderContext();
    const fileInfo: FileInfo = ['/test.md', FileModeFile];
    const actual = await loadEachItem(readFile, loaderContext, fileInfo);

    expect(actual).toBeInstanceOf(Error);
  });
});
