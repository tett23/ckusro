import { TargetDirectory } from '../../src/models/ckusroConfig';
import {
  LoaderContext,
  newLoaderContext,
} from '../../src/models/loaderContext';

describe(newLoaderContext, () => {
  it('returns LoaderContext', () => {
    const target: TargetDirectory = {
      path: '/test',
      name: 'test',
      innerPath: './foo',
    };
    const actual = newLoaderContext(target);
    const expected: LoaderContext = {
      path: '/test/foo',
      name: 'test',
    };

    expect(actual).toEqual(expected);
  });
});
