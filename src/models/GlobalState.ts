import { isNonNullObject } from '../core/utils/types';
import { isNamespace, Namespace } from './Namespace';
import { isPlugins, Plugins } from './plugins';

export type GlobalState = {
  readonly namespaces: Namespace[];
  readonly plugins: Plugins;
};

export function isGlobalState(value: unknown): value is GlobalState {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (!Array.isArray((value as GlobalState).namespaces)) {
    return false;
  }

  if (!(value as GlobalState).namespaces.every(isNamespace)) {
    return false;
  }

  if (!isPlugins((value as GlobalState).plugins)) {
    return false;
  }

  return true;
}
