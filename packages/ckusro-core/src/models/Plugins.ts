import { isNonNullObject } from '../utils/types';
import { ComponentPlugin } from './ComponentPlugin';
import { ParserPlugin } from './ParserPlugin';

export type Plugins<
  PP extends Record<string, unknown>,
  CP extends Record<string, unknown>
> = {
  parsers: Array<ParserPlugin<PP>>;
  components: Array<ComponentPlugin<CP>>;
};

export function isPlugins<
  PP extends Record<string, unknown>,
  CP extends Record<string, unknown>
>(obj: unknown): obj is Plugins<PP, CP> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (!Array.isArray(obj.parsers)) {
    return false;
  }
  if (!Array.isArray(obj.components)) {
    return false;
  }

  return true;
}
