import { join } from 'path';
import { TargetDirectory } from '../ckusroConfig';
import { LoaderConfig } from '../ckusroConfig/LoaderConfig';

export type LocalLoaderContext = {
  type: 'LocalLoaderContext';
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
