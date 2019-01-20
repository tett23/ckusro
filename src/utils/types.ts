// tslint:disable-next-line ban-types
export function isNonNullObject(obj: any): obj is Object {
  if (obj === null) {
    return false;
  }

  return typeof obj === 'object';
}

export function isErrors(obj: unknown): obj is Error[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every((item) => item instanceof Error);
}
