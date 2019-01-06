import { isParserPlugin, isParserPlugins } from '../../src/models/parserPlugin';

describe(isParserPlugin, () => {
  it('judges type', () => {
    const data: Array<[any, boolean]> = [
      [{ name: 'test', plugin: (_: any) => {} }, true], // tslint:disable-line no-empty
      [{ name: 'test', plugin: () => {} }, true], // tslint:disable-line no-empty
      [{ name: 'test', plugin: (_: any, __: any) => {} }, false], // tslint:disable-line no-empty
      [{ name: 1, plugin: () => {} }, false], // tslint:disable-line no-empty
      [{}, false],
      [null, false],
      [undefined, false],
      [1, false],
    ];
    data.forEach(([value, expected]) => {
      const actual = isParserPlugin(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isParserPlugins, () => {
  it('judges type', () => {
    const data: Array<[any, boolean]> = [
      [[], true],
      [[{ name: 'test', plugin: () => {} }], true], // tslint:disable-line no-empty
      [[{ name: 'test', plugin: (_: any) => {} }], true], // tslint:disable-line no-empty
      [[{ name: 'test', plugin: (_: any, __: any) => {} }], false], // tslint:disable-line no-empty
      [{}, false],
      [{ name: 'test', plugin: () => {} }, false], // tslint:disable-line no-empty
      [null, false],
      [undefined, false],
      [1, false],
      [[{}], false],
      [[null], false],
      [[undefined], false],
      [[1], false],
    ];
    data.forEach(([value, expected]) => {
      const actual = isParserPlugins(value);

      expect(actual).toBe(expected);
    });
  });
});
