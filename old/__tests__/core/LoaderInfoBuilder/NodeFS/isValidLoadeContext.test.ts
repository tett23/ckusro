import isValidLoaderContext from '../../../../src/core/LoaderInfoBuilder/NodeFS/isValidLoaderContext';
import {
  StatTypeDirectory,
  StatTypeFile,
} from '../../../../src/models/statType';
import { buildLocalLoaderContext } from '../../../__fixtures__';
import { statsFixture } from '../../../__fixtures__/testFS';

describe(isValidLoaderContext, () => {
  it('returns true when context path is directory', async () => {
    const lstat = jest.fn().mockResolvedValue(statsFixture(StatTypeDirectory));
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await isValidLoaderContext(lstat, context);

    expect(actual).toBe(true);
  });

  it('returns true when context path is file', async () => {
    const lstat = jest.fn().mockResolvedValue(statsFixture(StatTypeFile));
    const context = buildLocalLoaderContext({
      path: '/file.md',
    });
    const actual = await isValidLoaderContext(lstat, context);

    expect(actual).toBe(false);
  });

  it('returns false when rejected lstat', async () => {
    const lstat = jest.fn().mockRejectedValue(new Error());
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await isValidLoaderContext(lstat, context);

    expect(actual).toBe(false);
  });
});
