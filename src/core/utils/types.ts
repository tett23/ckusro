// tslint:disable-next-line ban-types
export function isNonNullObject(obj: any): obj is Object {
  if (obj === null) {
    return false;
  }
  if (Array.isArray(obj)) {
    return false;
  }

  return typeof obj === 'object';
}

export function isErrors(obj: unknown): obj is Error[] {
  const validator = (item: unknown): item is Error => item instanceof Error;
  if (!isArrayOf(obj, validator)) {
    return false;
  }

  if (obj.length === 0) {
    return false;
  }

  return true;
}

export type TypeNames =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'array'
  | 'object'
  | 'function';

export type Validator<T> = (value: unknown) => value is T;

export type AnyObject = {
  [key: string]: AnyValue;
};
export type AnyArray = any[];

export type AnyValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Function // tslint:disable-line ban-types
  | AnyArray
  | AnyObject;

export function isArrayOf<T>(
  obj: unknown,
  validator: Validator<T>,
): obj is T[] {
  if (!isTypeOf<T[]>(obj, 'array')) {
    return false;
  }

  return obj.every((item) => validator(item));
}

export function isPropertyValidTypeOf<O extends object, P extends keyof O, T>(
  obj: O,
  property: P,
  validator: Validator<T>,
): obj is O & Record<P, T> {
  if (!hasProperty(obj, property)) {
    return false;
  }

  return isValidTypeOf(obj[property], validator);
}

export function isValidTypeOf<T>(
  value: unknown,
  validator: (arg: unknown) => arg is T,
): value is T {
  return validator(value);
}

export function isPropertyTypeOf<O extends object, P extends keyof O, T>(
  obj: O,
  property: P,
  type: TypeNames,
): obj is O & Record<P, T> {
  if (!hasProperty(obj, property)) {
    return false;
  }

  return isTypeOf(obj[property], type);
}

export function isTypeOf<T>(value: unknown, type: TypeNames): value is T {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'null':
      return value === null;
    case 'undefined':
      return typeof value === 'undefined';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isNonNullObject(value);
    case 'function':
      return typeof value === 'function';
  }
}

export function hasProperty<O extends object, P extends keyof O>(
  obj: O,
  property: P,
): obj is O & Record<P, AnyValue> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  return obj.hasOwnProperty(property);
}
