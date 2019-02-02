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

  return obj.every((item) => item instanceof Error);
}
