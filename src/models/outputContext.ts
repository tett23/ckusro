import { join } from 'path';
import { CkusroConfig } from './ckusroConfig';
import { LoaderContext } from './loaderContext';

export type OutputContext = {
  name: string;
  path: string;
};

export function newOutputContext(
  config: CkusroConfig,
  loaderContext: LoaderContext,
) {
  return {
    name: loaderContext.name,
    path: join(config.outputDirectory, loaderContext.name),
  };
}
