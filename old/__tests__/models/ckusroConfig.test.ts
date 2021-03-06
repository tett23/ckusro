import {
  CkusroConfig,
  isCkusroConfig,
  isTargetDirectories,
  isTargetDirectory,
  TargetDirectory,
} from '../../src/models/ckusroConfig';
import {
  defaultLoaderConfig,
  isLoaderConfig,
  LoaderConfig,
} from '../../src/models/ckusroConfig/LoaderConfig';
import { LocalLoaderContextType } from '../../src/models/loaderContext/LocalLoaderContext';
import { buildPlugins, buildTargetDirectory } from '../__fixtures__';

describe(isTargetDirectory, () => {
  it('judges type', () => {
    const validData: TargetDirectory = {
      type: LocalLoaderContextType,
      path: '/foo',
      name: 'foo',
      innerPath: '.',
    };
    const data: Array<[any, boolean]> = [
      [validData, true],
      [{ path: 1 }, false],
      [[], false],
      [{}, false],
      [null, false],
      [undefined, false],
      [1, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isTargetDirectory(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isTargetDirectories, () => {
  it('judges type', () => {
    const validData: TargetDirectory[] = [
      {
        type: LocalLoaderContextType,
        path: '/foo',
        name: 'foo',
        innerPath: '.',
      },
    ];
    const data: Array<[any, boolean]> = [
      [validData, true],
      [[], true],
      [[{ path: 1 }], false],
      [[null], false],
      [[undefined], false],
      [[1], false],
      [[() => {}], false], // tslint:disable-line no-empty
      [{}, false],
      [null, false],
      [undefined, false],
      [1, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isTargetDirectories(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isLoaderConfig, () => {
  it('judges type', () => {
    const validData: LoaderConfig = defaultLoaderConfig();
    const data: Array<[any, boolean]> = [
      [validData, true],
      [{ enable: null }, false],
      [{ enable: undefined }, false],
      [{ enable: 1 }, false],
      [{}, false],
      [undefined, false],
      [null, false],
      [1, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isLoaderConfig(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isCkusroConfig, () => {
  it('judges type', () => {
    const validData: CkusroConfig = {
      outputDirectory: '/test',
      targetDirectories: [buildTargetDirectory()],
      loaderConfig: defaultLoaderConfig(),
      plugins: buildPlugins(),
    };
    const data: Array<[any, boolean]> = [
      [validData, true],
      [{}, false],
      [undefined, false],
      [null, false],
      [1, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isCkusroConfig(value);

      expect(actual).toBe(expected);
    });
  });
});
