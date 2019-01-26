import { isNonNullObject } from '../core/utils/types';
import { isLoaderContext, LoaderContext } from './loaderContext';
import { isOutputContext, OutputContext } from './outputContext';

export type Namespace = {
  name: string;
  loaderContext: LoaderContext;
  outputContext: OutputContext;
};

export function isNamespace(value: unknown): value is Namespace {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (typeof (value as Namespace).name !== 'string') {
    return false;
  }

  if (!isLoaderContext((value as Namespace).loaderContext)) {
    return false;
  }

  if (!isOutputContext((value as Namespace).outputContext)) {
    return false;
  }

  return true;
}
