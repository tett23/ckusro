import { isErrors, isNonNullObject } from '../../src/utils/types';

describe(isNonNullObject, () => {
  it('retuns true when argument is Object', () => {
    const data = [{}, { a: 1 }];
    data.forEach((value) => {
      const actual = isNonNullObject(value);

      expect(actual).toBe(true);
    });
  });

  it('retuns false when argument is null or other types', () => {
    // tslint:disable-next-line no-empty
    const data = [null, undefined, true, 1, () => {}];
    data.forEach((value) => {
      const actual = isNonNullObject(value);

      expect(actual).toBe(false);
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
