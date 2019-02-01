import { FileInfo } from '../../../../src/core/LoaderInfoBuilder/NodeFS/fetchEntries';
import loadContents, {
  loadEachItem,
} from '../../../../src/core/LoaderInfoBuilder/NodeFS/loadContents';
import { FileModeFile } from '../../../../src/models/StatType';
import {
  buildLocalLoaderContext,
  buildUnloadedFile,
} from '../../../__fixtures__';

describe(loadContents, () => {});

describe(loadEachItem, async () => {
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
