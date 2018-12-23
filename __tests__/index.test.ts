import { CkusroConfig } from '../src/config';
import main from '../src/index';
import { mockFileSystem, restoreFileSystem } from './__helpers__/fs';

describe(main.name, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = {
      targetDirectory: '/test',
      outputDirectory: '/out',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await main(conf);

    expect(actual).toEqual([true]);
  });

  it('returns Error when directory does not exist', async () => {
    const conf: CkusroConfig = {
      targetDirectory: '/does_not_exist',
      outputDirectory: '/out',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await main(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});
