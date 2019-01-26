import isValidLoaderContext from '../../../../src/core/LoaderInfoBuilder/NodeFS/isValidLoaderContext';
import { FSCallback, PathLike, Stats } from '../../../../src/core/types';
import {
  StatTypeDirectory,
  StatTypeFile,
} from '../../../../src/models/statType';
import { buildLocalLoaderContext } from '../../../__fixtures__';
import { statsFixture, testFS } from '../../../__fixtures__/testFS';

describe(isValidLoaderContext, () => {
  it('returns true when context path is directory', async () => {
    const fs = testFS({
      lstat: jest
        .fn()
        .mockImplementation((_: PathLike, callback: FSCallback<Stats>) => {
          callback(null as any, statsFixture(StatTypeDirectory));
        }),
    });
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await isValidLoaderContext(fs, context);

    expect(actual).toBe(true);
  });

  it('returns true when context path is file', async () => {
    const fs = testFS({
      lstat: jest
        .fn()
        .mockImplementation((_: PathLike, callback: FSCallback<Stats>) => {
          callback(null as any, statsFixture(StatTypeFile));
        }),
    });
    const context = buildLocalLoaderContext({
      path: '/file.md',
    });
    const actual = await isValidLoaderContext(fs, context);

    expect(actual).toBe(false);
  });

  it('returns false when lstat threw Error', async () => {
    const fs = testFS({
      lstat: jest
        .fn()
        .mockImplementation((_: PathLike, callback: FSCallback<Stats>) => {
          callback(new Error(), null as any);
        }),
    });
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await isValidLoaderContext(fs, context);

    expect(actual).toBe(false);
  });
});
