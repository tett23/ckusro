import { TargetDirectory } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import {
  LoaderContext,
  loaderContextMap,
  newLoaderContexts,
} from '../../../src/models/loaderContext';
import { buildLocalLoaderContext } from '../../__fixtures__';

describe(newLoaderContexts, () => {
  it('returns LoaderContext[]', () => {
    const target: TargetDirectory[] = [
      {
        path: '/test',
        name: 'test',
        innerPath: './foo',
      },
    ];
    const actual = newLoaderContexts(target, defaultLoaderConfig());
    const expected: LoaderContext[] = [
      {
        type: 'LocalLoaderContext',
        path: '/test/foo',
        name: 'test',
        loaderConfig: defaultLoaderConfig(),
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe(loaderContextMap, () => {
  it('returns LoaderContextMap', () => {
    const contexts = [
      buildLocalLoaderContext({ name: 'ns1' }),
      buildLocalLoaderContext({ name: 'ns2' }),
      buildLocalLoaderContext({ name: 'ns3' }),
    ];
    const actual = loaderContextMap(contexts);
    const expected = {
      ns1: contexts[0],
      ns2: contexts[1],
      ns3: contexts[2],
    };

    expect(actual).toEqual(expected);
  });
});
