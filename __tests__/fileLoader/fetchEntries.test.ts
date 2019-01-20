jest.mock('../../src/fileLoader/enablePaths');

import enablePaths from '../../src/fileLoader/enablePaths';
import fetchEntries, {
  fetchEntriesInContext,
} from '../../src/fileLoader/fetchEntries';
import { buildLoaderConfig, buildLoaderContext } from '../__fixtures__';

describe(fetchEntries, () => {
  it('returns LoaderContext-string tuples', async () => {
    const loaderContext = buildLoaderContext();
    const loaderConfig = buildLoaderConfig();

    // @ts-ignore
    enablePaths.mockImplementation(async () => [[loaderContext, '/foo.md']]);

    const actual = await fetchEntries([loaderContext], loaderConfig);

    expect(actual).toEqual([[loaderContext, '/foo.md']]);
  });

  it('returns Error array when fetchEntries returns Error', async () => {
    const err = new Error('');
    // @ts-ignore
    enablePaths.mockImplementation(async () => err);

    const loaderContext = buildLoaderContext();
    const loaderConfig = buildLoaderConfig();
    const actual = await fetchEntries([loaderContext], loaderConfig);

    expect(actual).toHaveLength(1);
    expect(actual[0]).toBeInstanceOf(Error);
  });
});

describe(fetchEntriesInContext, () => {
  it('returns LoaderContext-string tuples', async () => {
    const loaderContext = buildLoaderContext();
    const loaderConfig = buildLoaderConfig();

    // @ts-ignore
    enablePaths.mockImplementation(async () => [[loaderContext, '/foo.md']]);

    const actual = await fetchEntries([loaderContext], loaderConfig);

    expect(actual).toEqual([[loaderContext, '/foo.md']]);
  });

  it('returns Error when enablePaths raises Error', async () => {
    const err = new Error('');
    // @ts-ignore
    enablePaths.mockImplementation(async () => {
      throw err;
    });

    const loaderContext = buildLoaderContext();
    const loaderConfig = buildLoaderConfig();
    const actual = await fetchEntriesInContext(loaderContext, loaderConfig);

    expect(actual).toBeInstanceOf(Error);
  });
});
