import React from 'react';
import { Props } from '../../src/models/componentPlugin';
import { isPlugins, Plugins } from '../../src/models/plugins';

describe(isPlugins, () => {
  it('judges type', () => {
    const validData: Plugins[] = [
      { parsers: [], components: [] },
      { parsers: [{ name: 'test', plugin: (_: any) => {} }], components: [] }, // tslint:disable-line no-empty
      {
        parsers: [],
        components: [{ name: 'test', plugin: (_: Props) => <div /> }],
      },
    ];
    const data: Array<[any, boolean]> = [
      ...validData.map((item): [Plugins, boolean] => [item, true]),
      [{}, false],
      [{ parsers: [] }, false],
      [{ components: [] }, false],
      [null, false],
      [undefined, false],
      [1, false],
    ];
    data.forEach(([value, expected]) => {
      const actual = isPlugins(value);

      expect(actual).toBe(expected);
    });
  });
});
