import { isErrors } from '../../src/core/utils/types';
import { CkusroConfig } from '../../src/models/ckusroConfig';
import newGlobalState, {
  assetsDirectory,
  isGlobalState,
  outputDirectory,
} from '../../src/models/OldGlobalState';
import {
  buildCkusroConfig,
  buildGlobalState,
  buildOutputContext,
} from '../__fixtures__';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../__helpers__/mockFileSystem';

describe(newGlobalState, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

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

    expect(isErrors(actual)).toBe(true);
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

describe(isGlobalState, () => {
  it('judges type', () => {
    const data: Array<[any, boolean]> = [
      [buildGlobalState(), true],
      [undefined, false],
      [null, false],
      [true, false],
      [1, false],
      [[], false],
      [{}, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];

    data.forEach(([value, expected]) => {
      const actual = isGlobalState(value);

      expect(actual).toBe(expected);
    });
  });
});
