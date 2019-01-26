import React from 'react';
import {
  isComponentPlugin,
  isComponentPlugins,
  Props,
} from '../../src/models/ComponentPlugin';

describe(isComponentPlugin, () => {
  it('judges type', () => {
    const data: Array<[any, boolean]> = [
      [{ name: 'test', plugin: (_: Props) => <div /> }, true],
      [{ name: 1, plugin: (_: Props) => <div /> }, false],
      [{ name: 'test', plugin: () => null }, false],
      [{}, false],
      [null, false],
      [undefined, false],
      [1, false],
    ];
    data.forEach(([value, expected]) => {
      const actual = isComponentPlugin(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isComponentPlugins, () => {
  it('judges type', () => {
    const data: Array<[any, boolean]> = [
      [[], true],
      [[{ name: 'test', plugin: (_: Props) => <div /> }], true],
      [[{ name: 'test', plugin: () => null }], false],
      [{ name: 'test', plugin: (_: Props) => <div /> }, false],
      [{}, false],
      [null, false],
      [undefined, false],
      [1, false],
      [[{}], false],
      [[null], false],
      [[undefined], false],
      [[1], false],
    ];
    data.forEach(([value, expected]) => {
      const actual = isComponentPlugins(value);

      expect(actual).toBe(expected);
    });
  });
});
