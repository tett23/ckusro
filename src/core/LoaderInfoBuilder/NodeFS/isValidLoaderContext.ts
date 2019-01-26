import { promisify } from 'util';
import { detectType, FileTypeDirectory } from '../../../models/CkusroFile';
import { LoaderContext } from '../../../models/loaderContext';
import { FS } from '../../types';

export default async function isValidLoaderContext(
  fs: FS,
  context: LoaderContext,
): Promise<boolean> {
  const lstat = promisify(fs.lstat);
  const stats = await lstat(context.path).catch((err: Error) => err);
  if (stats instanceof Error) {
    return false;
  }

  return detectType(stats, context.path) === FileTypeDirectory;
}
