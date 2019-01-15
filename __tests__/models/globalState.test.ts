import { CkusroConfig } from '../../src/models/ckusroConfig';
import newGlobalState, {
  assetsDirectory,
  GlobalState,
  outputDirectory,
} from '../../src/models/globalState';
import {
  buildCkusroConfig,
  buildGlobalState,
  buildOutputContext,
} from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(newGlobalState, () => {
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
    const actual = await newGlobalState(conf);

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
    const actual = await newGlobalState(conf);

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(outputDirectory, () => {
  it('returns output path', () => {
    const globalState = buildGlobalState({
      outputContexts: [buildOutputContext({ path: '/out/foo' })],
    });
    const actual = outputDirectory(globalState);
    const expected = '/out';

    expect(actual).toBe(expected);
  });
});

describe(assetsDirectory, () => {
  it('returns assets path', () => {
    const globalState = buildGlobalState({
      outputContexts: [buildOutputContext({ path: '/out/foo' })],
    });
    const actual = assetsDirectory(globalState);
    const expected = '/out/assets';

    expect(actual).toBe(expected);
  });
});
