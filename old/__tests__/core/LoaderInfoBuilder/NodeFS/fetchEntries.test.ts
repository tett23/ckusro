import fs from 'fs';
import { promisify } from 'util';
import fetchEntries, {
  bindStat,
  FileInfo,
  filterFileInfo,
  readdirRecursive,
} from '../../../../src/core/LoaderInfoBuilder/NodeFS/fetchEntries';
import { FileModeFile, StatTypeFile } from '../../../../src/models/statType';
import {
  buildLoaderConfig,
  buildLocalLoaderContext,
} from '../../../__fixtures__';
import { statsFixture } from '../../../__fixtures__/testFS';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../../../__helpers__/mockFileSystem';

describe(fetchEntries, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test': {
        'foo.md': '',
      },
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns FileInfo[]', async () => {
    const readdir = promisify(fs.readdir);
    const lstat = promisify(fs.lstat);
    const context = buildLocalLoaderContext({ path: '/test' });
    const actual = await fetchEntries(readdir as any, lstat as any, context);
    const expected = [['/test/foo.md', 33206]]; // file

    expect(actual).toEqual(expected);
  });
});

describe(readdirRecursive, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test': {
        foo: {
          'bar.md': '',
          baz: {
            'hoge.md': '',
          },
        },
      },
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns file paths', async () => {
    const readdir = promisify(fs.readdir);
    const lstat = promisify(fs.lstat);
    const actual = await readdirRecursive(
      readdir as any,
      lstat as any,
      '/test',
    );
    const expected = [
      '/test/foo',
      '/test/foo/bar.md',
      '/test/foo/baz',
      '/test/foo/baz/hoge.md',
    ];

    expect(actual).toEqual(expected);
  });
});

describe(bindStat, () => {
  it('returns string-FileModes tuple', async () => {
    const lstat = jest.fn().mockResolvedValue(statsFixture(StatTypeFile));
    const actual = await bindStat(lstat, ['/foo']);
    const expected = [['/foo', FileModeFile]];

    expect(actual).toEqual(expected);
  });

  it('returns Error when lstat threw Error', async () => {
    const err = new Error();
    const lstat = jest.fn().mockRejectedValue(err);
    const actual = await bindStat(lstat, ['/foo']);
    const expected = [err];

    expect(actual).toEqual(expected);
  });
});

describe(filterFileInfo, () => {
  it('filter enable', () => {
    const items: FileInfo[] = [
      ['/foo.md', FileModeFile],
      ['/bar.js', FileModeFile],
    ];
    const loaderConfig = buildLoaderConfig({
      enable: /\.md/,
      ignore: [],
    });
    const actual = filterFileInfo(items, loaderConfig);
    const expected = [['/foo.md', FileModeFile]];

    expect(actual).toEqual(expected);
  });

  it('filter ignore', () => {
    const items: FileInfo[] = [
      ['/foo.md', FileModeFile],
      ['/bar.js', FileModeFile],
    ];
    const loaderConfig = buildLoaderConfig({
      enable: /.+/,
      ignore: [/\.js/],
    });
    const actual = filterFileInfo(items, loaderConfig);
    const expected = [['/foo.md', FileModeFile]];

    expect(actual).toEqual(expected);
  });
});
