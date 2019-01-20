import { LoaderConfig } from '../models/ckusroConfig/LoaderConfig';
import { LoaderContext } from '../models/loaderContext';
import enablePaths from './enablePaths';

export default async function fetchEntries(
  contexts: LoaderContext[],
  loaderConfig: LoaderConfig,
): Promise<Array<[LoaderContext, string]> | Error[]> {
  const ps = contexts.map((context) =>
    fetchEntriesInContext(context, loaderConfig),
  );
  const items = await Promise.all(ps);

  const errors = items
    .flatMap((item) => {
      return !(item instanceof Error) ? [] : [item];
    })
    .flatMap((item) => item);
  if (errors.length > 0) {
    return errors;
  }

  const ret = items.flatMap((item) => (item instanceof Error ? [] : item));

  return ret;
}

export async function fetchEntriesInContext(
  context: LoaderContext,
  loaderConfig: LoaderConfig,
): Promise<Array<[LoaderContext, string]> | Error> {
  const items = await enablePaths(context, loaderConfig).catch((err) => err);
  if (items instanceof Error) {
    return items;
  }

  return items;
}
