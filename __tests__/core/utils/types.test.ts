import {
  hasProperty,
  isArrayOf,
  isErrors,
  isNonNullObject,
  isPropertyTypeOf,
  isPropertyValidTypeOf,
  isTypeOf,
  isValidTypeOf,
} from '../../../src/core/utils/types';

describe(isNonNullObject, () => {
  it('judges types', () => {
    validate(isNonNullObject, [
      [[{}], true],
      [[{ a: 1 }], true],
      [[null], false],
      [[[]], false],
      [[undefined], false],
      [[true], false],
      [[1], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]);
  });
});

describe(isErrors, () => {
  it('judges types', () => {
    validate(isErrors, [
      [[[new Error()]], true],
      [[[new Error(), new Error()]], true],
      [[[]], false],
      [[[new Error(), 1]], false],
      [[[1, 1]], false],
      [[new Error()], false],
      [[undefined], false],
      [[null], false],
      [[true], false],
      [[1], false],
      [[[]], false],
      [[{}], false],
      [[() => {}], false], // tslint:disable-line no-empty
    ]);
  });
});

describe(isArrayOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    validate(isArrayOf, [
      [[[], validator], true],
      [[[1], validator], true],
      [[[1, true], validator], false],
      [[undefined, validator], false],
      [[null, validator], false],
      [[true, validator], false],
      [[1, validator], false],
      [[{}, validator], false],
      [[() => {}, validator], false], // tslint:disable-line no-empty
    ]);
  });
});

type AnyFunction = (...args: any[]) => any;
type ValidateData<F extends AnyFunction> = Array<
  [Parameters<F>, ReturnType<F>]
>;
function validate<F extends AnyFunction>(func: F, data: ValidateData<F>) {
  data.forEach(([args, expected]) => {
    const actual = func(...args);

    expect(actual).toBe(expected);
  });
}

describe(isPropertyValidTypeOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    validate(isPropertyValidTypeOf, [
      [[{ exists: 1 }, 'exists', validator], true],
      [[{ exists: true }, 'exists', validator], false],
      [[{ exists: undefined }, 'exists', validator], false],
      [[{ exists: 1 }, 'does_not_exists', validator], false],
      [[{}, 'does_not_exists', validator], false],
      [[1, 'does_not_exists', validator], false],
      [[true, 'does_not_exists', validator], false],
      [[undefined, 'does_not_exists', validator], false],
      [[null, 'does_not_exists', validator], false],
      [[() => {}, 'does_not_exists', validator], false], // tslint:disable-line no-empty
    ]);
  });
});

describe(isValidTypeOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    validate(isValidTypeOf, [
      [[1, validator], true],
      [[{}, validator], false],
      [[true, validator], false],
      [[undefined, validator], false],
      [[null, validator], false],
      [[() => {}, validator], false], // tslint:disable-line no-empty
    ]);
  });
});

describe(isPropertyTypeOf, () => {
  it('judges types', () => {
    validate(isPropertyTypeOf, [
      [[{ exists: 1 }, 'exists', 'number'], true],
      [[{ exists: true }, 'exists', 'number'], false],
      [[{ exists: undefined }, 'exists', 'number'], false],
      [[{ exists: 1 }, 'does_not_exists', 'number'], false],
      [[{}, 'does_not_exists', 'number'], false],
      [[1, 'does_not_exists', 'number'], false],
      [[true, 'does_not_exists', 'number'], false],
      [[undefined, 'does_not_exists', 'number'], false],
      [[null, 'does_not_exists', 'number'], false],
      [[() => {}, 'does_not_exists', 'number'], false], // tslint:disable-line no-empty
    ]);
  });
});

describe(isTypeOf, () => {
  it('judges types', () => {
    validate(isTypeOf, [
      [['', 'string'], true],
      [[true, 'string'], false],
      [[1, 'number'], true],
      [[true, 'number'], false],
      [[true, 'boolean'], true],
      [[false, 'boolean'], true],
      [[1, 'boolean'], false],
      [[null, 'null'], true],
      [[undefined, 'null'], false],
      [[true, 'null'], false],
      [[undefined, 'undefined'], true],
      [[null, 'undefined'], false],
      [[[], 'array'], true],
      [[[1], 'array'], true],
      [[[1, true], 'array'], true],
      [[{}, 'array'], false],
      [[1, 'array'], false],
      [[null, 'array'], false],
      [[{}, 'object'], true],
      [[{ a: 1 }, 'object'], true],
      [[null, 'object'], false],
      [[true, 'object'], false],
      [[() => {}, 'function'], true], // tslint:disable-line no-empty
      [[null, 'function'], false],
      [[undefined, 'function'], false],
      [[true, 'function'], false],
    ]);
  });
});

describe(hasProperty, () => {
  it('judges types', () => {
    validate(hasProperty, [
      [[{ exists: 1 }, 'exists'], true],
      [[{ exists: 1 }, 'does_not_exists'], false],
      [[{}, 'does_not_exists'], false],
      [[1, 'does_not_exists'], false],
      [[true, 'does_not_exists'], false],
      [[undefined, 'does_not_exists'], false],
      [[null, 'does_not_exists'], false],
      [[() => {}, 'does_not_exists'], false], // tslint:disable-line no-empty
    ]);
  });
});
