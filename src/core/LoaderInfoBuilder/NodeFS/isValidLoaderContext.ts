import { detectType, FileTypeDirectory } from '../../../models/CkusroFile';
import { LoaderContext } from '../../../models/loaderContext';
import { PromisifiedFS } from '../../types';

export default async function isValidLoaderContext(
  fs: PromisifiedFS,
  context: LoaderContext,
): Promise<boolean> {
  const stats = await fs.lstat(context.path).catch((err: Error) => err);
  if (stats instanceof Error) {
    return false;
  }

  return detectType(stats, context.path) === FileTypeDirectory;
}
