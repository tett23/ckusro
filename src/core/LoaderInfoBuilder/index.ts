import { FileBuffer, newFileBuffer } from '../../models/FileBuffer';
import {
  FileBuffersState,
  newFileBuffersState,
} from '../../models/FileBuffersState';
import { LoaderContext } from '../../models/loaderContext';
import { Namespace } from '../../models/Namespace';
import { Plugins } from '../../models/plugins';
import { UnloadedFile } from '../../models/UnloadedFile';
import { FS, PromisifiedFS } from '../types';
import { separateErrors } from '../utils/errors';
import promisifyFS from '../utils/promisifyFS';
import { isErrors } from '../utils/types';
import fetchEntries from './NodeFS/fetchEntries';
import isValidLoaderContext from './NodeFS/isValidLoaderContext';
import loadContents from './NodeFS/loadContents';
import loadDependencies from './NodeFS/loadDependencies';

export default async function LoaderInfoBuilder(
  fs: FS,
  namespace: Namespace,
  plugins: Plugins,
): Promise<FileBuffersState | Error[]> {
  const { loaderContext } = namespace;
  const promisifiedFs = promisifyFS(fs);
  const isValid = await isValidLoaderContext(
    promisifiedFs.lstat,
    loaderContext,
  ).catch((err: Error) => err);
  if (isValid instanceof Error) {
    return [isValid];
  }
  if (!isValid) {
    return [new Error(`LocalLoaderContext: ${loaderContext.path} not found.`)];
  }

  const result = await build(promisifiedFs, namespace.loaderContext);
  const [contents, errors] = separateErrors(result);
  if (isErrors(errors)) {
    return errors;
  }

  const fileBuffers: FileBuffer[] = contents
    .map(([unloadedFile, content]) => {
      return newFileBuffer(
        namespace,
        [unloadedFile.absolutePath, unloadedFile.mode],
        content,
      );
    })
    .map((file) => loadDependencies(plugins, file, fileBuffers));

  return newFileBuffersState(fileBuffers);
}

async function build(
  fs: PromisifiedFS,
  loaderContext: LoaderContext,
): Promise<Array<[UnloadedFile, string | Buffer | null] | Error>> {
  const entries = await fetchEntries(fs.readdir, fs.lstat, loaderContext);
  if (isErrors(entries)) {
    return entries;
  }

  return await loadContents(fs.readFile, loaderContext, entries);
}
