import { isNonNullObject } from '../core/utils/types';
import { CkusroFile } from './CkusroFile';

export type Props = {
  currentFileId: string;
  files: CkusroFile;
};

export type ComponentPlugin = {
  name: string;
  plugin: (props: any) => JSX.Element;
};

export function isComponentPlugins(obj: any): obj is ComponentPlugin[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  return obj.every(isComponentPlugin);
}

export function isComponentPlugin(obj: any): obj is ComponentPlugin {
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
