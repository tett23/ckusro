import { GlobalState, isGlobalState } from '../../src/models/GlobalState';
import { buildNamespace, buildPlugins } from '../__fixtures__';

describe(isGlobalState, () => {
  it('judges type', () => {
    const validData: GlobalState[] = [
      { namespaces: [], plugins: { parsers: [], components: [] } },
      {
        namespaces: [buildNamespace()],
        plugins: buildPlugins(),
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [GlobalState, true] => [item, true]),
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
      [1, false],
      [true, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];
    data.forEach(([value, expected]) => {
      const actual = isGlobalState(value);

      expect(actual).toBe(expected);
    });
  });
});
