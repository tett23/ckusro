import { detectType, FileTypeDirectory } from '../../../models/CkusroFile';
import { LoaderContext } from '../../../models/loaderContext';
import { FS, Promisify } from '../../types';

export default async function isValidLoaderContext(
  lstat: Promisify<FS['lstat']>,
  context: LoaderContext,
): Promise<boolean> {
  const stats = await lstat(context.path).catch((err: Error) => err);
  if (stats instanceof Error) {
    return false;
  }

  return detectType(stats, context.path) === FileTypeDirectory;
}
