import { TargetDirectory } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import { newLoaderContexts } from '../../../src/models/loaderContext';
import {
  LocalLoaderContext,
  newLocalLoaderContext,
} from '../../../src/models/loaderContext/localLoaderContext';

describe(newLoaderContexts, () => {
  it('returns LocalLoaderContext', () => {
    const target: TargetDirectory = {
      path: '/test',
      name: 'test',
      innerPath: './foo',
    };
    const actual = newLocalLoaderContext(target, defaultLoaderConfig());
    const expected: LocalLoaderContext = {
      type: 'LocalLoaderContext',
      path: '/test/foo',
      name: 'test',
      loaderConfig: defaultLoaderConfig(),
    };

    expect(actual).toEqual(expected);
  });
});
