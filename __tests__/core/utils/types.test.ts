import { isErrors, isNonNullObject } from '../../../src/core/utils/types';

describe(isNonNullObject, () => {
  it('judges types', () => {
    const data: Array<[any, boolean]> = [
      [{}, true],
      [{ a: 1 }, true],
      [null, false],
      [[], false],
      [undefined, false],
      [true, false],
      [1, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];

    data.forEach(([value, expected]) => {
      const actual = isNonNullObject(value);

      expect(actual).toBe(expected);
    });
  });
});

describe(isErrors, () => {
  it('judges types', () => {
    const data: Array<[any, boolean]> = [
      [[new Error()], true],
      [[new Error(), new Error()], true],
      [[], false],
      [[new Error(), 1], false],
      [[1, 1], false],
      [new Error(), false],
      [undefined, false],
      [null, false],
      [true, false],
      [1, false],
      [[], false],
      [{}, false],
      [() => {}, false], // tslint:disable-line no-empty
    ];

    data.forEach(([value, expected]) => {
      const actual = isErrors(value);

      expect(actual).toBe(expected);
    });
  });
});
