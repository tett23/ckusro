import { join } from 'path';
import { isNonNullObject } from '../../core/utils/types';
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

  if ((value as GitLoaderContext).type !== GitLoaderContextType) {
    return false;
  }

  if (typeof (value as GitLoaderContext).name !== 'string') {
    return false;
  }

  if (typeof (value as GitLoaderContext).path !== 'string') {
    return false;
  }

  if (!isLoaderConfig((value as GitLoaderContext).loaderConfig)) {
    return false;
  }

  return true;
}
