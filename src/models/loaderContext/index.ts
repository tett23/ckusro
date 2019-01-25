import { TargetDirectory } from '../ckusroConfig';
import { LoaderConfig } from '../ckusroConfig/LoaderConfig';
import { GitLoaderContext } from './gitLoaderContext';
import {
  LocalLoaderContext,
  newLocalLoaderContext,
} from './localLoaderContext';

export type LoaderContext = LocalLoaderContext | GitLoaderContext;

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
