import fs from 'fs';
import { promisify } from 'util';
import { detectType, FileTypeDirectory } from '../models/ckusroFile';
import { LoaderContext } from '../models/loaderContext';

const lstat = promisify(fs.lstat);

export default async function checkLoaderContexts(
  contexts: LoaderContext[],
): Promise<Error[]> {
  const ps = contexts.map(async (item) =>
    (await isValidLoaderContext(item))
      ? []
      : [new Error(`LoaderContext: ${item.path} not found.`)],
  );

  return (await Promise.all(ps)).flatMap((item) => item);
}

export async function isValidLoaderContext(
  context: LoaderContext,
): Promise<boolean> {
  const stats = await lstat(context.path).catch((err: Error) => err);
  if (stats instanceof Error) {
    return false;
  }

  return detectType(stats, context.path) === FileTypeDirectory;
}
