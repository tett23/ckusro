import { CkusroConfig } from '../../src/models/ckusroConfig';
import buildGlobalState, {
  GlobalState,
} from '../../src/staticRenderer/buildGlobalState';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(buildGlobalState, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  function isGlobalState(obj: any): obj is GlobalState {
    return (
      'loaderContexts' in obj &&
      'outputContexts' in obj &&
      'files' in obj &&
      'dependencyTable' in obj
    );
  }

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = {
      targetDirectories: [
        {
          path: '/test',
          name: 'test',
          innerPath: './',
        },
      ],
      outputDirectory: '/out',
      loaderConfig: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await buildGlobalState(conf);

    expect(isGlobalState(actual)).toBeTruthy();
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
    const actual = await buildGlobalState(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});
