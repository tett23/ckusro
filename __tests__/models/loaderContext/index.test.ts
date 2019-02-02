import { TargetDirectory } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import {
  isLoaderContext,
  isValidContextType,
  LoaderContext,
  loaderContextMap,
  newLoaderContexts,
} from '../../../src/models/loaderContext';
import { GitLoaderContextType } from '../../../src/models/loaderContext/GitLoaderContext';
import { LocalLoaderContextType } from '../../../src/models/loaderContext/LocalLoaderContext';
import {
  buildGitLoaderContext,
  buildLocalLoaderContext,
} from '../../__fixtures__';
import '../../__matchers__/toValidTypes';

describe(isValidContextType, () => {
  it('judges type', () => {
    expect([
      [[LocalLoaderContextType], true],
      [[GitLoaderContextType], true],
      [['unexpected_context_type'], false],
      [[{}], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]).toValidatePair(isValidContextType);
  });
});

describe(isLoaderContext, () => {
  it('judges type', () => {
    const validData: LoaderContext[] = [
      buildLocalLoaderContext(),
      buildGitLoaderContext(),
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [LoaderContext, true] => [item, true]),
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isLoaderContext(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(newLoaderContexts, () => {
  it('returns LoaderContext[]', () => {
    const target: TargetDirectory[] = [
      {
        type: LocalLoaderContextType,
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
