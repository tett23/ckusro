import { TargetDirectory } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import {
  GitLoaderContext,
  GitLoaderContextType,
  isGitLoaderContext,
  newGitLoaderContext,
} from '../../../src/models/loaderContext/GitLoaderContext';
import { buildLocalLoaderContext } from '../../__fixtures__';

describe(isGitLoaderContext, () => {
  it('judges type', () => {
    const validData: GitLoaderContext[] = [
      {
        type: GitLoaderContextType,
        path: '/test/foo',
        name: 'test',
        loaderConfig: defaultLoaderConfig(),
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [GitLoaderContext, true] => [item, true]),
      [buildLocalLoaderContext(), false],
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isGitLoaderContext(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(newGitLoaderContext, () => {
  it('returns GitLoaderContext', () => {
    const target: TargetDirectory = {
      type: GitLoaderContextType,
      path: '/test',
      name: 'test',
      innerPath: './foo',
    };
    const actual = newGitLoaderContext(target, defaultLoaderConfig());
    const expected: GitLoaderContext = {
      type: GitLoaderContextType,
      path: '/test/foo',
      name: 'test',
      loaderConfig: defaultLoaderConfig(),
    };

    expect(actual).toEqual(expected);
  });
});
