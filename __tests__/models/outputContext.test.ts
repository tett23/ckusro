import {
  isOutputContext,
  newOutputContext,
  OutputContext,
} from '../../src/models/outputContext';
import { buildCkusroConfig, buildLocalLoaderContext } from '../__fixtures__';

describe(newOutputContext, () => {
  it('returns OutputContext', () => {
    const config = buildCkusroConfig({
      targetDirectories: [{ path: '/out', name: 'out', innerPath: './' }],
    });
    const loaderContext = buildLocalLoaderContext({ name: 'test_ns' });
    const actual = newOutputContext(config, loaderContext);
    const expected: OutputContext = {
      name: 'test_ns',
      path: '/out/test_ns',
    };

    expect(actual).toEqual(expected);
  });
});

describe(isOutputContext, () => {
  it('judges type', () => {
    const validData: OutputContext[] = [
      {
        path: '/test/foo',
        name: 'test',
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [OutputContext, true] => [item, true]),
      [
        {
          name: 1,
          path: '/test',
        },
        false,
      ],
      [
        {
          name: 'test',
          path: 1,
        },
        false,
      ],
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isOutputContext(value);

      expect(actual).toBe(expected);
    });
  });
});
