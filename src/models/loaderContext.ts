import { join } from 'path';
import { TargetDirectory } from './ckusroConfig';
import { defaultLoaderConfig, LoaderConfig } from './ckusroConfig/LoaderConfig';

export type LoaderContext = {
  name: string;
  path: string;
  loaderConfig: LoaderConfig;
};

export function newLoaderContext({
  name,
  path,
  innerPath,
}: TargetDirectory): LoaderContext {
  return {
    name,
    path: join(path, innerPath),
    loaderConfig: defaultLoaderConfig(),
  };
}

export function newLoaderContexts(targets: TargetDirectory[]): LoaderContext[] {
  return targets.map(newLoaderContext);
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
