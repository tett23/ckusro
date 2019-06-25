import { isNonNullObject } from '../utils/types';
import { BlobObject } from './GitObject';

export type Props = {
  currentFileId: string;
  gitObjects: BlobObject[];
};

export type ComponentPlugin<P extends Record<string, unknown>> = {
  name: string;
  plugin: (props: P) => JSX.Element;
};

export function isComponentPlugins<P extends Record<string, unknown>>(
  obj: Array<ComponentPlugin<P>>,
): obj is Array<ComponentPlugin<P>> {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isComponentPlugin);
}

export function isComponentPlugin<P extends Record<string, unknown>>(
  obj: unknown,
): obj is ComponentPlugin<P> {
  if (!isNonNullObject(obj)) {
    return false;
  }

  if (typeof obj.name !== 'string') {
    return false;
  }

  if (typeof obj.plugin !== 'function') {
    return false;
  }
  if (obj.plugin.length !== 1) {
    return false;
  }

  return true;
}
