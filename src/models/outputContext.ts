import { join } from 'path';
import { LoaderContext } from '../loader';
import { CkusroConfig } from '../models/ckusroConfig';

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
