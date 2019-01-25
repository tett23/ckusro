import { separateErrors } from '../core/utils/errors';
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
  const [items, errors] = separateErrors(await Promise.all(ps));
  if (errors.length > 0) {
    return errors;
  }

  return items.flatMap((item) => item);
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
