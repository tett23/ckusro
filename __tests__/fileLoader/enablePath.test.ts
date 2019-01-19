import { enablePaths } from '../../src/fileLoader/enablePaths';
import { buildLoaderConfig, buildLoaderContext } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(enablePaths, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test': {
        'foo.md': '# test file',
        'bar.js': 'test file',
        node_modules: {
          hoge: {
            'index.js': 'test file',
          },
        },
      },
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns LoaderContext-string tuples', async () => {
    const loaderContext = buildLoaderContext({ path: '/test', name: 'test' });
    const loaderConfig = buildLoaderConfig({
      enable: /\.md/,
      ignore: [/node_modules/],
    });
    const actual = await enablePaths(loaderContext, loaderConfig);
    const expected = [[loaderContext, '/test/foo.md']];
    expect(actual).toEqual(expected);
  });
});
