import { isNonNullObject } from '../core/utils/types';

export type ParserPlugin = {
  name: string;
  plugin: (options?: any) => void;
};

export function isParserPlugins(obj: any): obj is ParserPlugin[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isParserPlugin);
}

export function isParserPlugin(obj: any): obj is ParserPlugin {
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
