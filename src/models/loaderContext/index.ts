import { TargetDirectory } from '../ckusroConfig';
import { LoaderConfig } from '../ckusroConfig/LoaderConfig';
import { GitLoaderContextType, isGitLoaderContext } from './GitLoaderContext';
import {
  isLocalLoaderContext,
  LocalLoaderContextType,
  newLocalLoaderContext,
} from './LocalLoaderContext';

export type ContextTypes =
  | typeof LocalLoaderContextType
  | typeof GitLoaderContextType;

export type LoaderContext = {
  type: ContextTypes;
  name: string;
  path: string;
  loaderConfig: LoaderConfig;
};

export function newLoaderContexts(
  targets: TargetDirectory[],
  loaderConfig: LoaderConfig,
): LoaderContext[] {
  return targets.map((item) => newLocalLoaderContext(item, loaderConfig));
}

type LoaderContextMap = { [key in string]: LoaderContext };

export function loaderContextMap(
  loaderContexts: LoaderContext[],
): LoaderContextMap {
  return loaderContexts.reduce(
    (acc, ns) => {
      acc[ns.name] = ns;
      return acc;
    },
    {} as LoaderContextMap,
  );
}

export function isLoaderContext(value: unknown): value is LoaderContext {
  return isLocalLoaderContext(value) || isGitLoaderContext(value);
}
