import main from '../src/index';
import { CkusroConfig } from '../src/models/ckusroConfig';
import { mockFileSystem, restoreFileSystem } from './__helpers__/fs';

describe(main.name, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/test_ns/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = {
      targetDirectories: [
        {
          path: '/test/test_ns',
          name: 'test_ns',
          innerPath: './',
        },
      ],
      outputDirectory: '/out',
      loaderConfig: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await main(conf);

    expect(actual).toEqual([true]);
  });

  it('returns Error when directory does not exist', async () => {
    const conf: CkusroConfig = {
      targetDirectories: [
        {
          path: '/does_not_exist',
          name: 'does_not_exist',
          innerPath: './',
        },
      ],
      outputDirectory: '/out',
      loaderConfig: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await main(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});
