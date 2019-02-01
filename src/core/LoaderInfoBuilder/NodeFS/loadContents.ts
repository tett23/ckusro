import { LoaderContext } from '../../../models/loaderContext';
import { loadContent, UnloadedFile } from '../../../models/UnloadedFile';
import { PromisifiedFS } from '../../types';
import { separateErrors } from '../../utils/errors';
import { isErrors } from '../../utils/types';
import { FileInfo } from './fetchEntries';

export default async function loadContents(
  readFile: PromisifiedFS['readFile'],
  loaderContext: LoaderContext,
  entries: FileInfo[],
): Promise<Array<[UnloadedFile, string | Buffer | null]> | Error[]> {
  const ps = entries.map((item) => loadEachItem(readFile, loaderContext, item));
  const results = await Promise.all(ps);
  const [contents, errors] = separateErrors(results);
  if (isErrors(errors)) {
    return errors;
  }

  return contents;
}

export async function loadEachItem(
  readFile: PromisifiedFS['readFile'],
  loaderContext: LoaderContext,
  [absolutePath, mode]: FileInfo,
): Promise<[UnloadedFile, string | Buffer | null] | Error> {
  const unloadedFile: UnloadedFile = {
    loaderContext,
    absolutePath,
    mode,
  };

  const result = await loadContent(readFile, unloadedFile);
  if (result instanceof Error) {
    return result;
  }

  return [unloadedFile, result];
}
