import { isNonNullObject } from '../../utils/types';
import { ComponentPlugin } from '../componentPlugin';
import { ParserPlugin } from '../parserPlugin';

export type Plugins = {
  parsers: ParserPlugin[];
  components: ComponentPlugin[];
};

export function isPlugins(obj: any): obj is Plugins {
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