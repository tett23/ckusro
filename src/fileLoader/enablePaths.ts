import fastGlob from 'fast-glob';
import { join } from 'path';
import { LoaderConfig } from '../models/ckusroConfig/LoaderConfig';
import { LoaderContext } from '../models/loaderContext';

export async function enablePaths(
  loaderContext: LoaderContext,
  loaderConfig: LoaderConfig,
): Promise<Array<[LoaderContext, string]> | Error> {
  const pattern = join(loaderContext.path, '**/*');
  const paths: string[] | Error = await fastGlob(pattern, {
    absolute: true,
  }).catch((err) => err);
  if (paths instanceof Error) {
    return paths;
  }

  return paths
    .filter((item) => [loaderConfig.enable].some((re) => re.test(item)))
    .filter((item) => loaderConfig.ignore.every((re) => !re.test(item)))
    .map((item): [LoaderContext, string] => [loaderContext, item]);
}
