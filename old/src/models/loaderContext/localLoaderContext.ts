import { join } from 'path';
import { isNonNullObject, isPropertyValidTypeOf } from '../../core/utils/types';
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

  const cast = value as LocalLoaderContext;

  return (
    isPropertyValidTypeOf(cast, 'type', 'string') &&
    cast.type === LocalLoaderContextType &&
    isPropertyValidTypeOf(cast, 'name', 'string') &&
    isPropertyValidTypeOf(cast, 'path', 'string') &&
    isPropertyValidTypeOf(cast, 'loaderConfig', isLoaderConfig)
  );
}
