import { isNonNullObject } from '../utils/types';

export type ParserPlugin<P extends Record<string, unknown>> = {
  name: string;
  plugin: (options?: P) => void;
};

export function isParserPlugins<P extends Record<string, unknown>>(
  obj: unknown,
): obj is Array<ParserPlugin<P>> {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isParserPlugin);
}

export function isParserPlugin<P extends Record<string, unknown>>(
  obj: unknown,
): obj is ParserPlugin<P> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (typeof obj.name !== 'string') {
    return false;
  }

  if (typeof obj.plugin !== 'function') {
    return false;
  }
  const arity = obj.plugin.length;
  if (!(arity === 0 || arity === 1)) {
    return false;
  }

  return true;
}
