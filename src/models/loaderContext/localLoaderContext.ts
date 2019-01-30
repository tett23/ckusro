import { join } from 'path';
import { isNonNullObject } from '../../core/utils/types';
import { TargetDirectory } from '../ckusroConfig';
import { isLoaderConfig, LoaderConfig } from '../ckusroConfig/LoaderConfig';

export const LocalLoaderContextType: 'LocalLoaderContext' =
  'LocalLoaderContext';

export type LocalLoaderContext = {
  type: typeof LocalLoaderContextType;
  name: string;
  path: string;
  loaderConfig: LoaderConfig;
};

export function newLocalLoaderContext(
  { name, path, innerPath }: TargetDirectory,
  loaderConfig: LoaderConfig,
): LocalLoaderContext {
  return {
    type: 'LocalLoaderContext',
    name,
    path: join(path, innerPath),
    loaderConfig,
  };
}

export function isLocalLoaderContext(
  value: unknown,
): value is LocalLoaderContext {
  if (!isNonNullObject(value)) {
    return false;
  }

  if ((value as LocalLoaderContext).type !== LocalLoaderContextType) {
    return false;
  }

  if (typeof (value as LocalLoaderContext).name !== 'string') {
    return false;
  }

  if (typeof (value as LocalLoaderContext).path !== 'string') {
    return false;
  }

  if (!isLoaderConfig((value as LocalLoaderContext).loaderConfig)) {
    return false;
  }

  return true;
}
