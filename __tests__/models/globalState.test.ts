import { CkusroConfig } from '../../src/models/ckusroConfig';
import buildGlobalState, { GlobalState } from '../../src/models/globalState';
import { buildCkusroConfig } from '../__fixtures__';
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
      'dependencyTable' in obj &&
      'invertedDependencyTable' in obj
    );
  }

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: '/test',
          name: 'test',
          innerPath: './',
        },
      ],
    });
    const actual = await buildGlobalState(conf);

    expect(isGlobalState(actual)).toBe(true);
  });

  it('returns Error when directory does not exist', async () => {
    const conf: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: '/does_not_exist',
          name: 'does_not_exist',
          innerPath: './',
        },
      ],
    });
    const actual = await buildGlobalState(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});