import { TargetDirectory } from '../../src/models/ckusroConfig';
import {
  LoaderContext,
  loaderContextMap,
  newLoaderContext,
  newLoaderContexts,
} from '../../src/models/loaderContext';
import { buildLoaderContext } from '../__fixtures__';

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

describe(newLoaderContexts, () => {
  it('returns LoaderContext[]', () => {
    const target: TargetDirectory[] = [
      {
        path: '/test',
        name: 'test',
        innerPath: './foo',
      },
    ];
    const actual = newLoaderContexts(target);
    const expected: LoaderContext[] = [
      {
        path: '/test/foo',
        name: 'test',
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe(loaderContextMap, () => {
  it('returns LoaderContextMap', () => {
    const contexts = [
      buildLoaderContext({ name: 'ns1' }),
      buildLoaderContext({ name: 'ns2' }),
      buildLoaderContext({ name: 'ns3' }),
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
