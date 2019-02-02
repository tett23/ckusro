jest.mock('../../src/core/LoaderInfoBuilder');

import LoaderInfoBuilder from '../../src/core/LoaderInfoBuilder';
import { FileBuffersState } from '../../src/models/FileBuffersState';
import {
  assetsDirectory,
  isGlobalState,
  outputDirectory,
  reloadFiles,
} from '../../src/models/GlobalState';
import {
  buildFileBufferState,
  buildGlobalState,
  buildNamespace,
  buildOutputContext,
} from '../__fixtures__';

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

describe(reloadFiles, () => {
  it('returns FileBufferState', async () => {
    const fbs1 = buildFileBufferState({
      fileBuffers: [],
      dependencyTable: {},
      invertedDependencyTable: {},
    });
    // @ts-ignore
    LoaderInfoBuilder.mockResolvedValueOnce(fbs1);

    const globalState = buildGlobalState();
    const actual = await reloadFiles(globalState);
    const expected: FileBuffersState = fbs1;

    expect(actual).toEqual(expected);
  });

  it('returns Error[] when LoaderInfoBuilder returns Error[]', async () => {
    const errors = [new Error()];
    // @ts-ignore
    LoaderInfoBuilder.mockResolvedValueOnce(errors);

    const globalState = buildGlobalState();
    const actual = await reloadFiles(globalState);
    const expected = errors;

    expect(actual).toEqual(expected);
  });
});

describe(outputDirectory, () => {
  it('returns output path', () => {
    const globalState = buildGlobalState({
      namespaces: [
        buildNamespace({
          outputContext: buildOutputContext({ path: '/out/foo' }),
        }),
      ],
    });
    const actual = outputDirectory(globalState);
    const expected = '/out';

    expect(actual).toBe(expected);
  });
});

describe(assetsDirectory, () => {
  it('returns assets path', () => {
    const globalState = buildGlobalState({
      namespaces: [
        buildNamespace({
          outputContext: buildOutputContext({ path: '/out/foo' }),
        }),
      ],
    });
    const actual = assetsDirectory(globalState);
    const expected = '/out/assets';

    expect(actual).toBe(expected);
  });
});
