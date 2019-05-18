import { join } from 'path';
import { isNonNullObject, isPropertyValidTypeOf } from '../../core/utils/types';
import { TargetDirectory } from '../ckusroConfig';
import { isLoaderConfig, LoaderConfig } from '../ckusroConfig/LoaderConfig';

export const GitLoaderContextType: 'GitLoaderContext' = 'GitLoaderContext';
export type GitLoaderContext = {
  type: typeof GitLoaderContextType;
  name: string;
  path: string;
  loaderConfig: LoaderConfig;
};

export function newGitLoaderContext(
  { name, path, innerPath }: TargetDirectory,
  loaderConfig: LoaderConfig,
): GitLoaderContext {
  return {
    type: 'GitLoaderContext',
    name,
    path: join(path, innerPath),
    loaderConfig,
  };
}

export function isGitLoaderContext(value: unknown): value is GitLoaderContext {
  if (!isNonNullObject(value)) {
    return false;
  }

  const cast = value as GitLoaderContext;

  return (
    isPropertyValidTypeOf(cast, 'type', 'string') &&
    cast.type === GitLoaderContextType &&
    isPropertyValidTypeOf(cast, 'name', 'string') &&
    isPropertyValidTypeOf(cast, 'path', 'string') &&
    isPropertyValidTypeOf(cast, 'loaderConfig', isLoaderConfig)
  );
}
