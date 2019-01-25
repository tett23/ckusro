jest.mock('fast-glob');

import fastGlob from 'fast-glob';
import enablePaths, { filterPaths } from '../../src/fileLoader/enablePaths';
import { buildLoaderConfig, buildLocalLoaderContext } from '../__fixtures__';

describe(enablePaths, () => {
  it('returns LoaderContext-string tuples', async () => {
    // @ts-ignore
    fastGlob.mockImplementation(async () => [
      '/test/foo.md',
      '/test/bar.js',
      '/test/node_modules/hoge/index.js',
    ]);

    const loaderContext = buildLocalLoaderContext({
      path: '/test',
      name: 'test',
    });
    const loaderConfig = buildLoaderConfig({
      enable: /\.md/,
      ignore: [/node_modules/],
    });
    const actual = await enablePaths(loaderContext, loaderConfig);
    const expected = [[loaderContext, '/test/foo.md']];
    expect(actual).toEqual(expected);
  });

  it('returns Error when fast-glob returns Error', async () => {
    const err = new Error('');
    // @ts-ignore
    fastGlob.mockImplementation(async () => err);

    const loaderContext = buildLocalLoaderContext();
    const loaderConfig = buildLoaderConfig();
    const actual = await enablePaths(loaderContext, loaderConfig);

    expect(actual).toEqual(err);
  });
});

describe(filterPaths, () => {
  it('filter enable', () => {
    const paths = ['/foo.md', '/bar.js'];
    const loaderConfig = buildLoaderConfig({
      enable: /\.md/,
      ignore: [],
    });
    const actual = filterPaths(paths, loaderConfig);
    const expected = ['/foo.md'];

    expect(actual).toEqual(expected);
  });

  it('filter ignore', () => {
    const paths = ['/foo.md', '/bar.js'];
    const loaderConfig = buildLoaderConfig({
      enable: /.+/,
      ignore: [/\.js/],
    });
    const actual = filterPaths(paths, loaderConfig);
    const expected = ['/foo.md'];

    expect(actual).toEqual(expected);
  });
});
