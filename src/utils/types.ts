// tslint:disable-next-line ban-types
export function isNonNullObject(obj: any): obj is Object {
  if (obj === null) {
    return false;
  }

  return typeof obj === 'object';
}
