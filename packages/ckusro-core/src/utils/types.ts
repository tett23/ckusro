import { FileTypes } from '../models/FileBuffer';

export function isNonNullObject(obj: unknown): obj is Record<string, unknown> {
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

export type AnyValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Function
  | any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  | {};

export function isArrayOf<T>(
  obj: unknown,
  validator: Validator<T>,
): obj is T[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isTypeOf<any[]>(obj, 'array')) {
    return false;
  }

  return obj.every((item) => validator(item));
}

export function isPropertyValidTypeOf<O, P extends keyof O>(
  obj: O,
  property: P,
  validator: TypeNames | Validator<O[P]>,
): obj is O & Record<P, O[P]> {
  if (!isNonNullObject(obj)) {
    return false;
  }
  if (!hasProperty<O, P>(obj, property)) {
    return false;
  }

  if (isFileTypes(validator)) {
    return isTypeOf(obj[property], validator);
  }

  return isValidTypeOf(obj[property], validator);
}

export function isFileTypes(v: unknown): v is TypeNames {
  if (typeof v !== 'string') {
    return false;
  }

  return [
    'string',
    'number',
    'boolean',
    'null',
    'undefiend',
    'array',
    'object',
    'function',
  ].includes(v);
}

export function isValidTypeOf<T>(
  value: unknown,
  validator: FileTypes | Validator<T>,
): value is T {
  if (isFileTypes(validator)) {
    return isTypeOf<T>(value, validator);
  }

  return (validator as Validator<T>)(value);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasProperty<O extends Record<string, any>, P extends keyof O>(
  obj: O,
  property: P,
): obj is O & Record<P, O[P]> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(property);
}
