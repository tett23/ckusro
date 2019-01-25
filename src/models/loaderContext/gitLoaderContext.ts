import { join } from 'path';
import { TargetDirectory } from '../ckusroConfig';
import { LoaderConfig } from '../ckusroConfig/LoaderConfig';

export type GitLoaderContext = {
  type: 'GitLoaderContext';
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
