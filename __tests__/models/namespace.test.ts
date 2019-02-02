import {
  isNamespace,
  Namespace,
  namespaceMap,
} from '../../src/models/Namespace';
import {
  buildLocalLoaderContext,
  buildNamespace,
  buildOutputContext,
} from '../__fixtures__';

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

describe(namespaceMap, () => {
  it('returns NamespaceMap', () => {
    const contexts = [
      buildNamespace({ name: 'ns1' }),
      buildNamespace({ name: 'ns2' }),
      buildNamespace({ name: 'ns3' }),
    ];
    const actual = namespaceMap(contexts);
    const expected = {
      ns1: contexts[0],
      ns2: contexts[1],
      ns3: contexts[2],
    };

    expect(actual).toEqual(expected);
  });
});
