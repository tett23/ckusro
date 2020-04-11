import {
  hasProperty,
  isArrayOf,
  isErrors,
  isNonNullObject,
  isPropertyValidTypeOf,
  isTypeOf,
  isValidTypeOf,
} from '../../src/utils/types';
import '../__matchers__/toValidTypes';

describe(isNonNullObject, () => {
  it('judges types', () => {
    expect([
      [[{}], true],
      [[{ a: 1 }], true],
      [[null], false],
      [[[]], false],
      [[undefined], false],
      [[true], false],
      [[1], false],
      [[() => {}], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(isNonNullObject);
  });
});

describe(isErrors, () => {
  it('judges types', () => {
    expect([
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
      [[() => {}], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(isErrors);
  });
});

describe(isArrayOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    expect([
      [[[], validator], true],
      [[[1], validator], true],
      [[[1, true], validator], false],
      [[undefined, validator], false],
      [[null, validator], false],
      [[true, validator], false],
      [[1, validator], false],
      [[{}, validator], false],
      [[() => {}, validator], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(isArrayOf);
  });
});

describe(isPropertyValidTypeOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    expect([
      [[{ exists: 1 }, 'exists', validator], true],
      [[{ exists: true }, 'exists', validator], false],
      [[{ exists: undefined }, 'exists', validator], false],
      [[{ exists: 1 }, 'does_not_exists', validator], false],
      [[{}, 'does_not_exists', validator], false],
      [[1, 'does_not_exists', validator], false],
      [[true, 'does_not_exists', validator], false],
      [[undefined, 'does_not_exists', validator], false],
      [[null, 'does_not_exists', validator], false],
      [[() => {}, 'does_not_exists', validator], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(isPropertyValidTypeOf);
  });
});

describe(isValidTypeOf, () => {
  it('judges types', () => {
    const validator = (obj: unknown): obj is number => typeof obj === 'number';

    expect([
      [[1, validator], true],
      [[{}, validator], false],
      [[true, validator], false],
      [[undefined, validator], false],
      [[null, validator], false],
      [[() => {}, validator], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(isValidTypeOf);
  });
});

describe(isTypeOf, () => {
  it('judges types', () => {
    expect([
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
      [[() => {}, 'function'], true], // eslint-disable-line @typescript-eslint/no-empty-function
      [[null, 'function'], false],
      [[undefined, 'function'], false],
      [[true, 'function'], false],
    ]).toValidatePair(isTypeOf);
  });
});

describe(hasProperty, () => {
  it('judges types', () => {
    expect([
      [[{ exists: 1 }, 'exists'], true],
      [[{ exists: 1 }, 'does_not_exists'], false],
      [[{}, 'does_not_exists'], false],
      [[1, 'does_not_exists'], false],
      [[true, 'does_not_exists'], false],
      [[undefined, 'does_not_exists'], false],
      [[null, 'does_not_exists'], false],
      [[() => {}, 'does_not_exists'], false], // eslint-disable-line @typescript-eslint/no-empty-function
    ]).toValidatePair(hasProperty);
  });
});
