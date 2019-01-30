import { join } from 'path';
import { isNonNullObject } from '../core/utils/types';
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

export function isOutputContext(value: unknown): value is OutputContext {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (typeof (value as OutputContext).name !== 'string') {
    return false;
  }

  if (typeof (value as OutputContext).path !== 'string') {
    return false;
  }

  return true;
}
