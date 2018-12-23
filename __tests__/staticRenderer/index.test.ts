import { CkusroConfig } from '../../src/config';
import { buildGlobalState } from '../../src/staticRenderer';
import { GlobalState } from '../../src/staticRenderer';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(buildGlobalState, () => {
  beforeEach(() => {
    mockFileSystem({
      '/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  function isGlobalState(obj: any): obj is GlobalState {
    return 'context' in obj && 'files' in obj && 'dependencyTable' in obj;
  }

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = {
      targetDirectory: '/foo',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await buildGlobalState(conf);

    expect(isGlobalState(actual)).toBeTruthy();
  });

  it('returns Error when directory does not exist', async () => {
    const conf: CkusroConfig = {
      targetDirectory: '/does_not_exist',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await buildGlobalState(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});