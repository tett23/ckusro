import { join } from 'path';
import { TargetDirectory } from './ckusroConfig';

export type LoaderContext = {
  name: string;
  path: string;
};

export function newLoaderContext({
  name,
  path,
  innerPath,
}: TargetDirectory): LoaderContext {
  return {
    name,
    path: join(path, innerPath),
  };
}

export function newLoaderContexts(targets: TargetDirectory[]): LoaderContext[] {
  return targets.map(newLoaderContext);
}
