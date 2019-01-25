import {
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
