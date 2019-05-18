import { isNonNullObject, isPropertyValidTypeOf } from '../core/utils/types';
import { isLoaderContext, LoaderContext } from './loaderContext';
import { isOutputContext, OutputContext } from './OutputContext';

export type Namespace = {
  name: string;
  loaderContext: LoaderContext;
  outputContext: OutputContext;
};

export function isNamespace(value: unknown): value is Namespace {
  if (!isNonNullObject(value)) {
    return false;
  }

  const cast = value as Namespace;

  return (
    isPropertyValidTypeOf(cast, 'name', 'string') &&
    isPropertyValidTypeOf(cast, 'loaderContext', isLoaderContext) &&
    isPropertyValidTypeOf(cast, 'outputContext', isOutputContext)
  );
}

export type NamespaceMap = { [key in string]: Namespace };

export function namespaceMap(namespaces: Namespace[]): NamespaceMap {
  return namespaces.reduce(
    (acc, ns) => {
      acc[ns.name] = ns;
      return acc;
    },
    {} as NamespaceMap,
  );
}
