import { TargetDirectory } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import {
  isLocalLoaderContext,
  LocalLoaderContext,
  LocalLoaderContextType,
  newLocalLoaderContext,
} from '../../../src/models/loaderContext/LocalLoaderContext';
import { buildGitLoaderContext } from '../../__fixtures__';

describe(isLocalLoaderContext, () => {
  it('judges type', () => {
    const validData: LocalLoaderContext[] = [
      {
        type: LocalLoaderContextType,
        path: '/test/foo',
        name: 'test',
        loaderConfig: defaultLoaderConfig(),
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [LocalLoaderContext, true] => [item, true]),
      [buildGitLoaderContext(), false],
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isLocalLoaderContext(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(newLocalLoaderContext, () => {
  it('returns LocalLoaderContext', () => {
    const target: TargetDirectory = {
      type: LocalLoaderContextType,
      path: '/test',
      name: 'test',
      innerPath: './foo',
    };
    const actual = newLocalLoaderContext(target, defaultLoaderConfig());
    const expected: LocalLoaderContext = {
      type: LocalLoaderContextType,
      path: '/test/foo',
      name: 'test',
      loaderConfig: defaultLoaderConfig(),
    };

    expect(actual).toEqual(expected);
  });
});
