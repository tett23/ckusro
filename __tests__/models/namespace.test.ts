import { isNamespace, Namespace } from '../../src/models/Namespace';
import { buildLocalLoaderContext, buildOutputContext } from '../__fixtures__';

describe(isNamespace, () => {
  it('judges type', () => {
    const validData: Namespace[] = [
      {
        name: 'ns',
        loaderContext: buildLocalLoaderContext(),
        outputContext: buildOutputContext(),
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [Namespace, true] => [item, true]),
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isNamespace(value);

      expect(actual).toBe(expected);
    });
  });
});
