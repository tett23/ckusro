import { LoaderContext } from '../../models/loaderContext';
import { LocalLoaderContextType } from '../../models/loaderContext/localLoaderContext';
import { Plugins } from '../../models/plugins';
import { FS } from '../types';
import promisifyFS from '../utils/promisifyFS';
import { isErrors } from '../utils/types';
import fetchEntries from './NodeFS/fetchEntries';
import isValidLoaderContext from './NodeFS/isValidLoaderContext';

export default async function LoaderInfoBuilder(
  fs: FS,
  context: LoaderContext,
  plugins: Plugins,
) {
  switch (context.type) {
    case LocalLoaderContextType:
      return node(fs, context, plugins);
    default:
      return new Error();
  }
}

async function node(fs: FS, context: LoaderContext, plugins: Plugins) {
  const promisifiedFs = promisifyFS(fs);
  const isValid = await isValidLoaderContext(
    promisifiedFs.lstat,
    context,
  ).catch((err: Error) => err);
  if (isValid instanceof Error) {
    return isValid;
  }
  if (!isValid) {
    return new Error(`LocalLoaderContext: ${context.path} not found.`);
  }

  const entries = await fetchEntries(
    promisifiedFs.readdir,
    promisifiedFs.lstat,
    context,
  );
  if (isErrors(entries)) {
    return entries;
  }
}
