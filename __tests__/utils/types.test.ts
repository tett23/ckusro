import { isNonNullObject } from '../../src/utils/types';

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
